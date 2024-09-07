import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

export default function GeneratedCard({ markdown }: any) {
  return (
    <div className="">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        className="prose-sm md:prose mx-auto text-justify shadow-neo rounded-xl p-10 my-10 lg:mb-10 overflow-hidden"
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
