"use server";

import mongoosedb from "@/app/lib/db/db";
import Post from "@/app/lib/models/Post";
import Reaction from "@/app/lib/models/Reaction";
import Notification from "@/app/lib/models/Notification";
import User from "@/app/lib/models/User";
import { withAuth } from "../../../../lib/middleware/auth";
import { ok, fail, serverError } from "../../../../lib/response";

const VALID_REACTIONS = ["like", "love", "haha", "wow", "sad", "angry"] as const;
type ReactionType = typeof VALID_REACTIONS[number];

// POST /api/posts/[id]/reactions — toggle a reaction
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  return withAuth(req, async (user) => {
    try {
      await mongoosedb();
      const {id} = await params
      const body = await req.json();
      const type = body.type as ReactionType;
     
      if (!VALID_REACTIONS.includes(type)) {
        return fail(`Invalid reaction type. Must be one of: ${VALID_REACTIONS.join(", ")}`);
      }

      const post = await Post.findById(id);
      if (!post || post.isDeleted) return fail("Post not found.", 404);
      

      // Check if already reacted with same type — toggle off
      const existing = await Reaction.findOne({ post: id, user: user._id });
      
      if (existing) {
        if (existing.type === type) {
          // Remove reaction
          await existing.deleteOne();
          await Post.findByIdAndUpdate(id, {
            $inc: { [`reactionCount.${type}`]: -1 },
          });
          await User.findByIdAndUpdate(post.author, { $inc: { reputation: -1 } });
          return ok({ toggled: false, type });
        }

       
        // Switch reaction type
        const oldType = existing.type;
        await Reaction.findByIdAndUpdate(existing._id, { type });
        await Post.findByIdAndUpdate(id, {
          $inc: {
            [`reactionCount.${oldType}`]: -1,
            [`reactionCount.${type}`]: 1,
          },
        });
        return ok({ toggled: true, type });
      }

      // New reaction
      await Reaction.create({ post: id, user: user._id, type });
      await Post.findByIdAndUpdate(id, {
        $inc: { [`reactionCount.${type}`]: 1 },
      });
      await User.findByIdAndUpdate(post.author, { $inc: { reputation: 1 } });

      // Notify post author
      if (post.author.toString() !== user._id.toString()) 
      {
      await Notification.create({
        user:  post.author,
        type:  "reaction",
        actor: user._id,
        post:  id,
      });
    }

      return ok({ toggled: true, type });
    } catch (err) {
      return serverError(err, "POST /api/posts/[id]/reactions");
    }
  });
}