"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Image as ImageIcon, AlertCircle, ChevronDown } from "lucide-react";
import { ThreadService } from "@/app/services/threads";
import { RichEditor } from "@/app/MainPage/trendingThreads/threadcomponent/RichEditor";

const MAX_TAGS = 5;

const PREFIXES = [
  { value: "Discussion", color: "#1877f2", desc: "General conversation" },
  { value: "Question",   color: "#e69c00", desc: "Seeking help or answers" },
  { value: "Guide",      color: "#1ca35e", desc: "Tutorial or how-to" },
  { value: "News",       color: "#c43f3f", desc: "Announcements & updates" },
  { value: "Poll",       color: "#9b5de5", desc: "Community vote" },
];

export default function NewThreadPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const subforumId   = searchParams.get("subforumId") ?? "";
  const categoryId   = searchParams.get("categoryId") ?? undefined;
  const subforumName = searchParams.get("subforumName") ?? "Unknown Forum";

  const [title, setTitle]           = useState("");
  const [prefix, setPrefix]         = useState("");
  const [prefixOpen, setPrefixOpen] = useState(false);
  const [tags, setTags]             = useState<string[]>([]);
  const [tagInput, setTagInput]     = useState("");
  const [image, setImage]           = useState("");
  const [imageError, setImageError] = useState("");
  const [error, setError]           = useState("");

  const prefixRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (prefixRef.current && !prefixRef.current.contains(e.target as Node)) {
        setPrefixOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addTag = (raw: string) => {
    const value = raw.trim().replace(/,$/, "");
    if (!value) return;
    if (tags.length >= MAX_TAGS) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setTagInput("");
      return;
    }
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (value: string) => {
    setTags((prev) => prev.filter((t) => t !== value));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = async (html: string) => {
    setError("");
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!image.trim()) { setError("Please enter an image link."); return; }
    if (!subforumId)   { setError("No subforum selected."); return; }

    const { data, success } = await ThreadService.create({
      title: title.trim(),
      content: html,
      image: image.trim(),
      tags,
      prefix: prefix || undefined,
      subforumId,
      categoryId,
    });
    const id = data?.thread?._id;

    if (success) {
      const params = new URLSearchParams({ page: "1" });
      router.replace(`/f/${subforumId}/${id}?${params.toString()}`);
    }
  };

  const selectedPrefix = PREFIXES.find((p) => p.value === prefix);

  return (
    <div className="min-h-screen bg-[#18191a] text-[#e4e6eb]">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8a8d91] mb-5">
          <button onClick={() => router.back()} className="hover:text-[#e4e6eb] transition-colors">
            Forums
          </button>
          <span>/</span>
          <span className="text-[#e4e6eb]">{subforumName}</span>
          <span>/</span>
          <span className="text-[#1877f2]">New Thread</span>
        </div>

        <h1 className="text-xl font-bold text-[#e4e6eb] mb-5">Post New Thread</h1>

        {/* Page-level error */}
        {error && (
          <div className="flex items-center gap-2 bg-[#3a1a1a] border border-[rgba(255,80,80,0.3)] text-[#ff6b6b] text-sm px-4 py-3 rounded-lg mb-4">
            <X size={14} />
            {error}
          </div>
        )}

        <div className="space-y-3">

          {/* Title */}
          <input
            type="text"
            placeholder="Thread title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full h-10 px-3 bg-[#242526] border border-[rgba(255,255,255,0.08)] rounded-lg text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none focus:border-[#1877f2] transition-colors"
          />

          {/* Prefix dropdown */}
          <div className="relative" ref={prefixRef}>
            <button
              type="button"
              onClick={() => setPrefixOpen((o) => !o)}
              className={`flex items-center gap-2 w-full h-10 px-3 bg-[#242526] border rounded-lg text-sm transition-colors ${
                prefixOpen
                  ? "border-[#1877f2]"
                  : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)]"
              }`}
              aria-haspopup="listbox"
              aria-expanded={prefixOpen}
            >
              {selectedPrefix && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: selectedPrefix.color }}
                />
              )}

              <span className={`flex-1 text-left ${!prefix ? "text-[#8a8d91]" : "text-[#e4e6eb]"}`}>
                {prefix || "Select a prefix… (optional)"}
              </span>

              {prefix && (
                <span
                  role="button"
                  aria-label="Clear prefix"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPrefix("");
                  }}
                  className="flex items-center justify-center w-4 h-4 rounded hover:bg-white/10 text-[#8a8d91] hover:text-[#e4e6eb] transition-colors"
                >
                  <X size={10} />
                </span>
              )}

              <ChevronDown
                size={14}
                className={`text-[#8a8d91] transition-transform duration-150 ${prefixOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
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

                {/* No prefix option */}
                <button
                  type="button"
                  role="option"
                  aria-selected={prefix === ""}
                  onClick={() => { setPrefix(""); setPrefixOpen(false); }}
                  className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors ${
                    prefix === ""
                      ? "bg-[#1877f2]/10 text-[#1877f2]"
                      : "text-[#8a8d91] hover:bg-white/5"
                  }`}
                >
                  No prefix
                </button>

                {PREFIXES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    role="option"
                    aria-selected={prefix === p.value}
                    onClick={() => { setPrefix(p.value); setPrefixOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-sm transition-colors ${
                      prefix === p.value
                        ? "bg-[#1877f2]/10 text-[#1877f2]"
                        : "text-[#e4e6eb] hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: p.color }}
                    />
                    <span className="flex-1 text-left">{p.value}</span>
                    <span className="text-xs text-[#8a8d91]">{p.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1.5 min-h-10 px-3 py-1.5 bg-[#242526] border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-[#1877f2] transition-colors">
              {tags.map((tag) => (
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
                className="flex-1 min-w-[100px] bg-transparent text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none disabled:cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-[#4a4b50]">
              {tags.length}/{MAX_TAGS} tags · press Enter or comma to add
            </span>
          </div>

          {/* Image link — compulsory */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 h-10 px-3 bg-[#242526] border border-[rgba(255,255,255,0.08)] rounded-lg focus-within:border-[#1877f2] transition-colors">
              <ImageIcon size={14} className="text-[#8a8d91] shrink-0" />
              <input
                type="url"
                placeholder="Image link…"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  if (imageError) setImageError("");
                }}
                className="flex-1 bg-transparent text-sm text-[#e4e6eb] placeholder:text-[#8a8d91] focus:outline-none"
              />
              <span className="text-[10px] uppercase tracking-wide text-[#1877f2] font-semibold shrink-0">
                Required
              </span>
            </div>
            {imageError && (
              <span className="flex items-center gap-1 text-[#ff6b6b] text-xs">
                <AlertCircle size={12} />
                {imageError}
              </span>
            )}
            {image && !imageError && (
              <div className="rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] max-h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Thread preview"
                  className="w-full h-40 object-cover"
                  onError={() => setImageError("This image link couldn't be loaded.")}
                />
              </div>
            )}
          </div>

          {/* Rich editor */}
          <RichEditor
            placeholder="Write your thread content here…"
            submitLabel="Post Thread"
            footerNote={`Posting in ${subforumName}`}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            autoFocus
          />

        </div>
      </div>
    </div>
  );
}