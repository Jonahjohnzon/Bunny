/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Pin, Lock, MessageSquare, Eye, Pencil, Trash2,
  AlertTriangle, X, ChevronDown, ImageIcon as ImageLucide,
  AlertCircle, Loader2, Save, LockOpen,
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { formatNumber, prefixStyles } from '../../Interfaces/lib/utils';
import { Thread } from '../../types/forum';
import { formatTimeAgo } from '@/app/n/component/utils';
import { ThreadService, ThreadUpdateBody } from '@/app/services/threads';
import { store } from '@/app/store';
import { useSnapshot } from 'valtio';
import { useRouter } from 'nextjs-toploader/app';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ThreadRowProps {
  thread: Thread;
  accentColor: string;
  subforumId: string;
  currentUserId?: string;
  currentUserRole?: {
    permissions?: {
      canDeleteAnyPost?: boolean;
      canEditAnyPost?: boolean;
    };
  };
  onDeleted?: (id: string | undefined) => void;
  onUpdated?: (id: string | undefined, patch: ThreadUpdateBody) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_TAGS = 5;

const PREFIXES = [
  { value: "Discussion", color: "#1877f2", desc: "General conversation" },
  { value: "Question",   color: "#e69c00", desc: "Seeking help or answers" },
  { value: "Guide",      color: "#1ca35e", desc: "Tutorial or how-to" },
  { value: "News",       color: "#c43f3f", desc: "Announcements & updates" },
  { value: "Poll",       color: "#9b5de5", desc: "Community vote" },
];

// ── Delete Modal ──────────────────────────────────────────────────────────────

function DeleteModal({
  onConfirm,
  onCancel,
  loading,
  error,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#242526] border border-[rgba(255,255,255,0.1)] rounded-xl w-full max-w-sm mx-4 p-5 shadow-2xl">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#3a1a1a] shrink-0">
            <AlertTriangle size={15} className="text-[#ff6b6b]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#e4e6eb] mb-1">Delete this thread?</p>
            <p className="text-xs text-[#8a8d91] leading-relaxed">
              This will permanently remove the thread and all its replies.
            </p>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 bg-[#3a1a1a] border border-[rgba(255,80,80,0.3)] text-[#ff6b6b] text-xs px-3 py-2 rounded-lg mb-3">
            <X size={12} /> {error}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="h-8 px-3.5 rounded-lg text-xs text-[#a3a5ab] bg-[#1e1f20] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="h-8 px-3.5 rounded-lg text-xs font-semibold text-white bg-[#c43f3f] hover:bg-[#d94f4f] transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading ? (
              <><span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Deleting…</>
            ) : (
              <><Trash2 size={11} />Delete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toggle tile (Pin / Lock) ──────────────────────────────────────────────────

function ToggleTile({
  active,
  onToggle,
  icon,
  label,
  description,
  activeColor,
  activeBg,
}: {
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  activeColor: string;
  activeBg: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-all text-left ${
        active
          ? `border-current bg-opacity-10`
          : "border-[rgba(255,255,255,0.08)] bg-[#242526] hover:border-[rgba(255,255,255,0.18)]"
      }`}
      style={active ? { borderColor: activeColor, backgroundColor: activeBg, color: activeColor } : {}}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
          active ? "bg-white/10" : "bg-[#1e1f20]"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${active ? "" : "text-[#e4e6eb]"}`}>
          {label}
        </p>
        <p className={`text-xs mt-0.5 ${active ? "opacity-70" : "text-[#4a4b50]"}`}>
          {description}
        </p>
      </div>
      {/* Toggle pill */}
      <div
        className={`relative w-9 h-5 rounded-full shrink-0 transition-colors ${
          active ? "" : "bg-[#3a3b3c]"
        }`}
        style={active ? { backgroundColor: activeColor } : {}}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            active ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({
  thread,
  canModerate,
  onSaved,
  onCancel,
}: {
  thread: Thread;
  canModerate: boolean;
  onSaved: (patch: ThreadUpdateBody) => void;
  onCancel: () => void;
}) {
  const [fetchLoading, setFetchLoading]   = useState(true);
  const [fetchError, setFetchError]       = useState("");
  const [submitError, setSubmitError]     = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Seeded immediately from props so fields are never blank while fetching
  const [title, setTitle]           = useState(thread.title ?? "");
  const [prefix, setPrefix]         = useState(thread.prefix ?? "");
  const [tags, setTags]             = useState<string[]>(thread.tags ?? []);
  const [tagInput, setTagInput]     = useState("");
  const [image, setImage]           = useState(thread.image ?? "");
  const [imageError, setImageError] = useState("");
  const [prefixOpen, setPrefixOpen] = useState(false);
  const [isPinned, setIsPinned]     = useState(thread.isPinned ?? false);
  const [isLocked, setIsLocked]     = useState(thread.isLocked ?? false);

  const prefixRef = useRef<HTMLDivElement>(null);

  // Close prefix dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (prefixRef.current && !prefixRef.current.contains(e.target as Node))
        setPrefixOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  // Fetch fresh data — overwrites prop values with server truth
  useEffect(() => {
    (async () => {
      try {
        const result = await ThreadService.getById(thread._id);
        if (!result.success) {
          setFetchError("Showing cached values — couldn't refresh from server.");
          return;
        }
        const t = result.data;
        setTitle(t.title ?? thread.title ?? "");
        setImage(t.image ?? thread.image ?? "");
        setTags(Array.isArray(t.tags) ? t.tags : (thread.tags ?? []));
        setPrefix(t.prefix ?? thread.prefix ?? "");
        setIsPinned(t.isPinned ?? thread.isPinned ?? false);
        setIsLocked(t.isLocked ?? thread.isLocked ?? false);
      } catch {
        setFetchError("Showing cached values — couldn't refresh from server.");
      } finally {
        setFetchLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread._id]);

  const addTag = (raw: string) => {
    const value = raw.trim().replace(/,$/, "");
    if (!value || tags.length >= MAX_TAGS) return;
    if (tags.some(t => t.toLowerCase() === value.toLowerCase())) { setTagInput(""); return; }
    setTags(prev => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (value: string) =>
    setTags(prev => prev.filter(t => t !== value));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); }
    else if (e.key === "Backspace" && !tagInput && tags.length) removeTag(tags[tags.length - 1]);
  };

  const handleSaveClick = async () => {
    setSubmitError("");
    if (!title.trim()) { setSubmitError("Please enter a title."); return; }
    if (!image.trim()) { setSubmitError("Please enter an image link."); return; }

    setSubmitLoading(true);
    try {
      const payload: ThreadUpdateBody = {
        title:  title.trim(),
        image:  image.trim(),
        tags,
        prefix: prefix || undefined,
        ...(canModerate && { isPinned, isLocked }),
      };
      const result = await ThreadService.update(thread._id, payload);
      if (!result.success) {
        setSubmitError("Failed to save changes. Please try again.");
        return;
      }
      onSaved(payload);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };
 
  const selectedPrefix = PREFIXES.find(p => p.value === prefix);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center  justify-center  bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-[#18191a]  border border-[rgba(255,255,255,0.1)] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[rgba(255,255,255,0.07)] shrink-0">
          <h2 className="text-sm font-semibold text-[#e4e6eb]">Edit Thread</h2>
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-[#8a8d91] hover:text-[#e4e6eb] hover:bg-white/8 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto scrollbar-track-black scrollbar-thumb-white scrollbar-thin flex-1 px-5 py-4">

          {fetchError && (
            <div className="flex items-center gap-2 bg-[#2a1f10] border border-[rgba(255,180,0,0.25)] text-[#e69c00] text-xs px-3 py-2 rounded-lg mb-3">
              <AlertCircle size={12} className="shrink-0" /> {fetchError}
            </div>
          )}

          {submitError && (
            <div className="flex items-center gap-2 bg-[#3a1a1a] border border-[rgba(255,80,80,0.3)] text-[#ff6b6b] text-sm px-4 py-3 rounded-lg mb-3">
              <X size={14} className="shrink-0" /> {submitError}
            </div>
          )}

          <div className="space-y-4">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#4a4b50] font-semibold">Title</label>
              <input
                type="text"
                placeholder="Thread title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className="w-full h-10 px-3 bg-[#242526] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none focus:border-[#1877f2] transition-colors"
              />
            </div>

            {/* Prefix */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#4a4b50] font-semibold">Prefix</label>
              <div className="relative" ref={prefixRef}>
                <button
                  type="button"
                  onClick={() => setPrefixOpen(o => !o)}
                  className={`flex items-center gap-2 w-full h-10 px-3 bg-[#242526] border rounded-lg text-sm transition-colors ${
                    prefixOpen
                      ? "border-[#1877f2]"
                      : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
                  }`}
                  aria-haspopup="listbox"
                  aria-expanded={prefixOpen}
                >
                  {selectedPrefix && (
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: selectedPrefix.color }} />
                  )}
                  <span className={`flex-1 text-left ${!prefix ? "text-[#8a8d91]" : "text-[#e4e6eb]"}`}>
                    {prefix || "Select a prefix… (optional)"}
                  </span>
                  {prefix && (
                    <span
                      role="button"
                      aria-label="Clear prefix"
                      onClick={(e) => { e.stopPropagation(); setPrefix(""); }}
                      className="flex items-center justify-center w-4 h-4 rounded hover:bg-white/10 text-[#8a8d91] hover:text-[#e4e6eb] transition-colors"
                    >
                      <X size={10} />
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-[#8a8d91] transition-transform duration-150 ${prefixOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {prefixOpen && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-[#2d2e2f] border border-[rgba(255,255,255,0.12)] rounded-lg overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    role="listbox"
                  >
                    <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-[#8a8d91] font-medium">
                      Thread prefix
                    </div>
                    <button
                      type="button"
                      role="option"
                      aria-selected={prefix === ""}
                      onClick={() => { setPrefix(""); setPrefixOpen(false); }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors ${
                        prefix === "" ? "bg-[#1877f2]/10 text-[#1877f2]" : "text-[#8a8d91] hover:bg-white/5"
                      }`}
                    >
                      No prefix
                    </button>
                    {PREFIXES.map(p => (
                      <button
                        key={p.value}
                        type="button"
                        role="option"
                        aria-selected={prefix === p.value}
                        onClick={() => { setPrefix(p.value); setPrefixOpen(false); }}
                        className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors ${
                          prefix === p.value ? "bg-[#1877f2]/10 text-[#1877f2]" : "text-[#e4e6eb] hover:bg-white/5"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                        <span className="flex-1 text-left">{p.value}</span>
                        <span className="text-xs text-[#8a8d91]">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#4a4b50] font-semibold">Tags</label>
              <div className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-1.5 bg-[#242526] border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-[#1877f2] transition-colors">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-[#1877f2]/15 text-[#1877f2] text-xs font-medium pl-2 pr-1 py-1 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-[#1877f2]/20 rounded p-0.5 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => addTag(tagInput)}
                  placeholder={tags.length ? "" : "Add tags… (press Enter)"}
                  disabled={tags.length >= MAX_TAGS}
                  className="flex-1 min-w-25 bg-transparent text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none disabled:cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-[#4a4b50]">
                {tags.length}/{MAX_TAGS} tags · press Enter or comma to add
              </span>
            </div>

            {/* Image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#4a4b50] font-semibold">Image</label>
              <div className={`flex items-center gap-2 h-10 px-3 bg-[#242526] border rounded-lg focus-within:border-[#1877f2] transition-colors ${
                imageError ? "border-[rgba(255,80,80,0.5)]" : "border-[rgba(255,255,255,0.08)]"
              }`}>
                <ImageLucide size={14} className="text-[#8a8d91] shrink-0" />
                <input
                  type="url"
                  placeholder="Image URL…"
                  value={image}
                  onChange={(e) => { setImage(e.target.value); setImageError(""); }}
                  className="flex-1 bg-transparent text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none"
                />
                <span className="text-[10px] uppercase tracking-wide text-[#1877f2] font-semibold shrink-0">
                  Required
                </span>
              </div>
              {imageError && (
                <span className="flex items-center gap-1 text-[#ff6b6b] text-xs">
                  <AlertCircle size={12} /> {imageError}
                </span>
              )}
              {image && !imageError && (
                <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img
                    src={image}
                    alt="Thread preview"
                    className="w-full h-36 object-cover"
                    onError={() => setImageError("This image URL couldn't be loaded.")}
                  />
                </div>
              )}
            </div>

            {/* ── Moderation controls (admin / mod only) ── */}
            {canModerate && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 mb-0.5">
                  <label className="text-[11px] uppercase tracking-wider text-[#4a4b50] font-semibold">
                    Moderation
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-[#9b5de5] font-bold px-1.5 py-0.5 rounded bg-[#9b5de5]/10 border border-[#9b5de5]/20">
                    Mod
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <ToggleTile
                    active={isPinned}
                    onToggle={() => setIsPinned(v => !v)}
                    icon={<Pin size={15} className={isPinned ? "" : "text-[#8a8d91]"} />}
                    label="Pin thread"
                    description="Keeps this thread at the top of the subforum"
                    activeColor="#f59e0b"
                    activeBg="rgba(245,158,11,0.08)"
                  />
                  <ToggleTile
                    active={isLocked}
                    onToggle={() => setIsLocked(v => !v)}
                    icon={isLocked
                      ? <Lock size={15} />
                      : <LockOpen size={15} className="text-[#8a8d91]" />
                    }
                    label="Lock thread"
                    description="Prevents new replies from being posted"
                    activeColor="#ff6b6b"
                    activeBg="rgba(255,107,107,0.08)"
                  />
                </div>
              </div>
            )}

          </div>

          {fetchLoading && (
            <div className="flex items-center gap-2 mt-4 text-[#4a4b50] text-xs">
              <Loader2 size={12} className="animate-spin" /> Refreshing from server…
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[rgba(255,255,255,0.07)] shrink-0">
          <button
            onClick={onCancel}
            disabled={submitLoading}
            className="h-8 px-3.5 rounded-lg text-xs text-[#a3a5ab] bg-[#242526] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={submitLoading}
            className="h-8 px-4 rounded-lg text-xs font-semibold text-white bg-[#1877f2] hover:bg-[#1a6fd4] transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {submitLoading ? (
              <><Loader2 size={12} className="animate-spin" />Saving…</>
            ) : (
              <><Save size={11} />Save Changes</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── ThreadRow ─────────────────────────────────────────────────────────────────

export default function ThreadRow({
  thread,
  accentColor,
  subforumId,
  onDeleted,
  onUpdated,
}: ThreadRowProps) {
  const prefix = thread.prefix ? prefixStyles[thread.prefix] : null;
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading]     = useState(false);
  const [deleteError, setDeleteError]         = useState("");
  const [showEditModal, setShowEditModal]     = useState(false);

  const snap         = useSnapshot(store);
  const isAuthor     = !!snap?._id && snap?._id === thread.author?._id;
  const canDeleteAny = !!snap.role?.permissions?.canDeleteOwnThread;
  const canEditAny   = !!snap.role?.permissions?.canEditAnyPost;
  const canModerate  = !!snap.role?.permissions?.canPinThread || !!snap.role?.permissions?.canLockThread;
  const canDelete    = canDeleteAny;
  const canEdit      = isAuthor || canEditAny;

  async function handleDeleteConfirm() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const result = await ThreadService.delete(thread._id) as { success: boolean };
      if (!result.success) {
        setDeleteError("Failed to delete thread. Please try again.");
        setDeleteLoading(false);
        return;
      }
      setShowDeleteModal(false);
      onDeleted?.(thread._id);
    } catch {
      setDeleteError("Something went wrong. Please try again.");
      setDeleteLoading(false);
    }
  }

  const handleEditSaved = useCallback((patch: ThreadUpdateBody) => {
    setShowEditModal(false);
    onUpdated?.(thread._id, patch);
  }, [thread._id, onUpdated]);

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setShowDeleteModal(false); setDeleteError(""); }}
          loading={deleteLoading}
          error={deleteError}
        />
      )}

      {showEditModal && (
        <EditModal
          thread={thread}
          canModerate={canModerate}
          onSaved={handleEditSaved}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      <div className="relative flex items-start gap-4 px-4 py-3 hover:bg-[#2a2b2f] transition-colors duration-150 group  border-b border-[rgba(255,255,255,0.04)] last:border-b-0">

        {/* Left accent bar */}
        <div
          className="w-0.5 h-10 rounded-full shrink-0 mt-1"
          style={{ backgroundColor: accentColor, opacity: thread.isPinned ? 1 : 0.35 }}
        />

        {/* Thumbnail */}
        <div className="hidden sm:block shrink-0 cursor-pointer" onClick={()=>{
                router.push(`/f/${subforumId}/${thread._id}?page=1`)
              }}>
          <img
            src={thread.image ?? ''}
            alt={thread.title ?? 'thread'}
            className="object-cover rounded-md h-20 w-20 "
          />
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0 font-semibold">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            {thread.isPinned && <Pin size={12} className="text-[#f59e0b] shrink-0" />}
            {thread.isLocked && <Lock size={12} className="text-[#babcc4] shrink-0" />}
            {prefix && (
              <span
                className="text-[12px] font-bold px-1.5 py-0.5 rounded shrink-0"
                style={{ backgroundColor: prefix.bg, color: prefix.color }}
              >
                {prefix.label}
              </span>
            )}
            <Link
              href={{ pathname: `/f/${subforumId}/${thread._id}`, query: { page: 1 } }}
              className="text-[#e4e6eb] hover:underline font-semibold text-base transition-colors truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {thread.title}
            </Link>
          </div>
          <p className="text-[#b1b5ba] text-[13px] truncate">
            by <span className="text-[#c8cddb] hover:underline cursor-pointer "  onClick={()=>{
                router.push(`/u/${thread?.author?.username}`)
              }}>{thread.author?.username}</span>
            {thread?.tags?.length > 0 && (
              <><span className="mx-1.5 text-[13px]">·</span>{thread.tags.map(t => `#${t}`).join(' ')}</>
            )}
          </p>

          {(canEdit || canDelete) && (
            <div className="flex items-center gap-2 mt-1.5 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {canEdit && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditModal(true); }}
                  className="flex items-center gap-1 text-[12px] text-[#aeb1b6] hover:text-[#4b8ef1] transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteError(""); setShowDeleteModal(true); }}
                  className="flex items-center gap-1 text-[11px] text-[#8a8d91] hover:text-[#ff6b6b] transition-colors"
                >
                  <Trash2 size={11} /> Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="hidden sm:flex font-semibold items-center gap-6 shrink-0">
          <div className="text-center w-12">
            <div className="text-[#e4e6eb] text-base font-semibold flex items-center justify-center gap-1">
              <MessageSquare size={12} className="text-[#4a4b50] mr-1" />
              {formatNumber(thread.replyCount)}
            </div>
            <div className="text-[#8a8d91] font-semibold  text-[11px] uppercase tracking-wide">Replies</div>
          </div>
          <div className="text-center w-12">
            <div className="text-[#e4e6eb] text-base font-semibold flex items-center justify-center gap-1">
              <Eye size={12} className="text-[#4a4b50] mr-1" />
              {formatNumber(thread.views)}
            </div>
            <div className="text-[#8a8d91] text-[11px] uppercase tracking-wide">Views</div>
          </div>
        </div>

        {/* Last post */}
        <div className="hidden md:flex font-semibold items-center gap-2.5 w-44 shrink-0">
          {thread.lastPost ? (
            <>
              <Avatar name={thread?.lastPost?.user?.username} src={thread?.lastPost?.user?.avatar} size="md"  />
              <div className="min-w-0" >
                <p className="text-[#a8b3cf] text-sm truncate font-medium leading-tight  cursor-pointer hover:underline" onClick={()=>{
                router.push(`/u/${thread?.lastPost?.user?.username}`)
              }}>
                  {thread.lastPost.user.username}
                </p>
                <p className="text-[#bcc0c5] text-[12px] mt-0.5">
                  {formatTimeAgo(thread.lastPost.createdAt)} 
                </p>
              </div>
            </>
          ) : (
            <p className="text-[#4a4b50] text-xs">No replies yet</p>
          )}
        </div>
      </div>
    </>
  );
}