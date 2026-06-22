import { useState, useRef, useCallback, useEffect } from "react";

export interface FormatState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  isCode: boolean;
  isQuote: boolean;
  heading: null | "h1" | "h2" | "h3" | "p";
}



const DEFAULT_FORMAT: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  orderedList: false,
  unorderedList: false,
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  isCode: false,
  isQuote: false,
  heading: null,
};

export function useRichEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);


  const [charCount, setCharCount] = useState(0);
  const [formatState, setFormatState] = useState<FormatState>(DEFAULT_FORMAT);

  // ── Selection helpers ─────────────────────────────────────────────────────
const saveSelection = useCallback(() => {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);

  // Ignore selection changes that aren't inside the editor — e.g. the user
  // typing into a toolbar popover's URL input. Without this guard, that
  // typing (or the delay during an async link-preview fetch) silently
  // overwrites the correct saved range with one pointing nowhere useful,
  // so the eventual insert has nothing valid to restore into.
  if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

  savedRange.current = range.cloneRange();
}, []);

const restoreSelection = useCallback(() => {
  const sel = window.getSelection();
  const range = savedRange.current;

  if (!sel || !range) return;

  sel.removeAllRanges();
  sel.addRange(range);
}, []);

  const getCharCount = useCallback(() => {
  return editorRef.current?.innerText.length ?? 0;
}, []);

const clear = useCallback(() => {
  const el = editorRef.current;
  if (!el) return;

  el.innerHTML = "";
  savedRange.current = null;
  setCharCount(0);
  setFormatState(DEFAULT_FORMAT);
}, []);


// useRichEditor.ts — add this
const handleEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;
  const link = target.closest('a');
  if (!link) return;

  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();
    window.open(link.href, '_blank', 'noopener,noreferrer');
  }
  // plain click without modifier: do nothing, let cursor placement happen normally
}, []);

  // ── Toolbar state sync ────────────────────────────────────────────────────
const updateToolbarState = useCallback(() => {
  requestAnimationFrame(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const anchorNode = selection.anchorNode as HTMLElement | null;
    const parent =
      anchorNode?.nodeType === 3
        ? anchorNode.parentElement
        : (anchorNode as HTMLElement);

    const tagName = parent?.tagName?.toLowerCase();

    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
      orderedList: document.queryCommandState("insertOrderedList"),
      unorderedList: document.queryCommandState("insertUnorderedList"),
      alignLeft: document.queryCommandState("justifyLeft"),
      alignCenter: document.queryCommandState("justifyCenter"),
      alignRight: document.queryCommandState("justifyRight"),
      isCode: tagName === "code" || !!parent?.closest("pre"),
      isQuote: tagName === "blockquote",
      heading:
        tagName === "h1"
          ? "h1"
          : tagName === "h2"
          ? "h2"
          : tagName === "h3"
          ? "h3"
          : tagName === "p"
          ? "p"
          : null,
    });
  });
}, []);

  // ── Sync html + char count on input ──────────────────────────────────────
const handleInput = useCallback(() => {
  const el = editorRef.current;
  if (!el) return;

  setCharCount(el.innerText.length);
}, []);



  // ── Core exec wrapper ─────────────────────────────────────────────────────
 const exec = useCallback((cmd: string, value?: string) => {
  const el = editorRef.current;
  if (!el) return;

  el.focus();

  restoreSelection(); // 🔥 KEY FIX

  setTimeout(() => {
    document.execCommand(cmd, false, value);
    updateToolbarState();
    handleInput();
  }, 0);
}, [restoreSelection, updateToolbarState, handleInput]);

  // ── Listen for selection changes globally ─────────────────────────────────
useEffect(() => {
  document.addEventListener("selectionchange", saveSelection);
  return () => document.removeEventListener("selectionchange", saveSelection);
}, [saveSelection]);

  // ── High-level insert helpers ─────────────────────────────────────────────
  const insertHeading = (tag: string) => {
  const el = editorRef.current;
  if (!el) return;

  el.focus();
  restoreSelection();

  setTimeout(() => {
    document.execCommand("formatBlock", false, `<${tag}>`);
    updateToolbarState();
    handleInput();
  }, 0);
};

  const insertHR = useCallback(() => {
    exec("insertHTML", '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:12px 0"/><p><br></p>');
  }, [exec]);

  const insertCode = useCallback(() => {
    const text = window.getSelection()?.toString() || "code here";
    exec(
      "insertHTML",
      `<pre style="background:#1b1c1f;border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:12px;font-family:monospace;font-size:13px;white-space:pre-wrap;color:#e4e6eb">${text}</pre><p><br></p>`,
    );
  }, [exec]);

  const insertQuote = useCallback(() => {
    const text = window.getSelection()?.toString() || "Quote text here";
    exec(
      "insertHTML",
      `<blockquote style="border-left:3px solid #1877f2;margin:8px 0;padding:8px 12px;background:rgba(24,119,242,0.08);color:#9fa3aa;border-radius:0 4px 4px 0">${text}</blockquote><p><br></p>`,
    );
  }, [exec]);

  const insertTable = useCallback(() => {
    exec("insertHTML", `
      <table style="border-collapse:collapse;width:100%;margin:8px 0">
        <thead><tr>
          <th style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px;background:rgba(255,255,255,0.05);text-align:left">Header 1</th>
          <th style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px;background:rgba(255,255,255,0.05);text-align:left">Header 2</th>
          <th style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px;background:rgba(255,255,255,0.05);text-align:left">Header 3</th>
        </tr></thead>
        <tbody><tr>
          <td style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px">Cell</td>
          <td style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px">Cell</td>
          <td style="border:1px solid rgba(255,255,255,0.1);padding:8px 12px">Cell</td>
        </tr></tbody>
      </table><p><br></p>
    `);
  }, [exec]);

  const insertEmoji = useCallback((emoji: string) => {
    restoreSelection();
    exec("insertText", emoji);
  }, [restoreSelection, exec]);

const insertLink = useCallback((url: string, displayText?: string) => {
  restoreSelection();

  const display = displayText?.trim() || url;

  exec(
    "insertHTML",
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`
  );
}, [restoreSelection, exec]);

  const insertVideoEmbed = useCallback((src: string) => {
    exec(
      "insertHTML",
      `<div contenteditable="false" style="position:relative;max-width:560px;aspect-ratio:16/9;margin:10px 0;border-radius:8px;overflow:hidden;background:#000">` +
        `<iframe src="${src}" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>` +
      `</div><p><br></p>`,
    );
  }, [exec]);

  const insertLinkCard = useCallback((meta: {
    url: string; title: string; description: string; image: string; siteName: string;
  }) => {
    exec(
      "insertHTML",
      `<a href="${meta.url}" target="_blank" rel="noopener noreferrer" contenteditable="false" style="display:flex;margin:10px 0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;overflow:hidden;background:#1b1c1f;text-decoration:none;max-width:560px">` +
        (meta.image ? `<div style="width:120px;flex-shrink:0;background-image:url('${meta.image}');background-size:cover;background-position:center"></div>` : "") +
        `<div style="padding:10px 12px;min-width:0;flex:1">` +
          `<p style="color:#8a8d91;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;margin:0 0 4px">${meta.siteName}</p>` +
          `<p style="color:#e4e6eb;font-size:13px;font-weight:600;margin:0 0 4px;line-height:1.3">${meta.title}</p>` +
          (meta.description ? `<p style="color:#9fa3aa;font-size:12px;margin:0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${meta.description}</p>` : "") +
        `</div>` +
      `</a><p><br></p>`,
    );
  }, [exec]);

  return {
    editorRef,
    charCount,
    formatState,
    getCharCount,
    exec,
    saveSelection,
    restoreSelection,
    updateToolbarState,
    handleInput,
    insertHeading,
    insertHR,
    insertCode,
    insertQuote,
    insertTable,
    insertEmoji,
    insertLink,
    insertVideoEmbed,
    insertLinkCard,
    clear
  };
}