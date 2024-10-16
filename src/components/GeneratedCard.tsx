import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

export default function GeneratedCard({ markdown }: any) {
  return (
    <div className="prose-sm md:prose prose-h1:text-xl flex flex-col mx-auto text-justify shadow-none rounded-none md:shadow-neo md:rounded-xl p-5 md:p-10 my-10 lg:mb-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
