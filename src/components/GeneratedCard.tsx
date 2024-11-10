import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

export default function GeneratedCard({ markdown }: any) {
  return (
    <div className="prose-sm prose-h1:text-2xl prose-h1:font-semibold prose-p:my-0 lg:prose flex flex-col mx-auto my-10 lg:mb-10 text-start">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
