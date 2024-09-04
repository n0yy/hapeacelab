import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

export default function GeneratedCard({ markdown }: any) {
  return (
    <div className="">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose mx-auto shadow-neo rounded-xl p-10 mb-10 lg:mb-3 overflow-hidden"
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
