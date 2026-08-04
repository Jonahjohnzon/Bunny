"use server";

import mongoosedb from "@/app/lib/db/db";
import Post from "@/app/lib/models/Post";
import User from "@/app/lib/models/User";
import { withAuth, withPermission } from "../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../lib/response";
import Thread from "@/app/lib/models/ThreadSchema";
import Subforum from "@/app/lib/models/SubforumSchema";
import { bumpThreadVersion, bumpVersion } from "@/app/lib/cache";

// DELETE /api/posts/[id] — soft delete
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    return withPermission(req, "canDeleteAnyPost", async (user) => {
  
    try {
      await mongoosedb();
      const {id} = await params
      const post = await Post.findById(id);
      if (!post || post.isDeleted) return fail("Post not found.", 404);

      const isAuthor = post.author.toString() === user._id.toString();
      const canMod   = user.role?.permissions?.canDeleteAnyPost;

      if (!isAuthor && !canMod) return fail("Not allowed.", 403);
      if (isAuthor && !user.role?.permissions?.canDeleteOwnPost && !canMod) {
        return fail("You cannot delete posts.", 403);
      }

      await Post.findByIdAndUpdate(id, {
        isDeleted: true,
        deletedBy: user._id,
      });

      // Need the thread to get its actual subforum — do this before the
      // decrements below so we have subforum id for the cache bump too.
      const thread = await Thread.findById(post.thread).select("subforum");

      // Decrement counts
      await Thread.findByIdAndUpdate(post.thread, { $inc: { replyCount: -1 } });
      if (thread?.subforum) {
        // NOTE: previously this matched on `{ "lastPost.thread": post.thread }`,
        // which only updates a subforum if this thread happens to currently be
        // its lastPost — so postCount silently failed to decrement any other
        // time. Using the post's actual thread->subforum instead.
        await Subforum.findByIdAndUpdate(thread.subforum, { $inc: { postCount: -1 } });
      }
      await User.findByIdAndUpdate(post.author, { $inc: { postCount: -1 } });

      // If this was a nested reply, decrement its parent's child-reply count too
      if (post.parentPost) {
        await Post.findByIdAndUpdate(post.parentPost, { $inc: { replyCount: -1 } });
      }

      // A deleted post disappears from the thread/threadPosts payload, and
      // the subforum's postCount just changed too.
      await bumpThreadVersion(post.thread.toString());
      if (thread?.subforum) {
        await bumpVersion("subforum", thread.subforum.toString());
      }

      return ok({ message: "Post deleted." });
    } catch (err) {
      return serverError(err, "DELETE /api/posts/[id]");
    }
  });
}

// PATCH /api/posts/[id] — edit post content
export async function PATCH(
  req: Request,
  { params }:{ params: Promise<{ id: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const {id} = await params
      const post = await Post.findById(id);
      if (!post || post.isDeleted) return fail("Post not found.", 404);

      const isAuthor = post.author.toString() === user._id.toString();
      const canMod   = user.role?.permissions?.canEditAnyPost;

      if (!isAuthor && !canMod) return fail("Not allowed.", 403);
      if (isAuthor && !user.role?.permissions?.canEditOwnPost && !canMod) {
        return fail("You cannot edit posts.", 403);
      }

      const body = await req.json();
      if (!body.content?.trim()) return fail("Content is required.");

      const updated = await Post.findByIdAndUpdate(
        id,
        {
          content:    body.content.trim(),
          editedAt:   new Date(),
          editedBy:   user._id,
          editReason: body.editReason ?? null,
        },
        { new: true }
      ).populate("author", "username avatar role customTitle postCount avatarEffect usernameEffect");

      // Edited content is embedded in the cached thread/threadPosts payload.
      await bumpThreadVersion(post.thread.toString());

      return ok(updated);
    } catch (err) {
      return serverError(err, "PATCH /api/posts/[id]");
    }
  });
}