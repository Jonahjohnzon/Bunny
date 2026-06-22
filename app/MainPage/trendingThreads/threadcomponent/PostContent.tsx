interface PostContentProps {
  html: string;
}

export default function PostContent({ html }: PostContentProps) {
  return (
    <div
      className="post-content text-sm text-[#cfd2d8] leading-relaxed [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_strong]:text-[#e4e6eb] [&_strong]:font-semibold [&_em]:italic [&_a]:text-[#4b8ef1] [&_a]:underline [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#4b8ef1] [&_blockquote]:bg-[rgba(75,142,241,0.08)] [&_blockquote]:rounded-md [&_blockquote]:px-3 [&_blockquote]:py-1.5 [&_blockquote]:my-2 [&_blockquote]:text-[#a8b3cf] [&_pre]:bg-[#141517] [&_pre]:border [&_pre]:border-[rgba(255,255,255,0.06)] [&_pre]:rounded-md [&_pre]:px-2.5 [&_pre]:py-2 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-1.5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}