import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface StreamingTextProps {
  content: string;
  onStreamingComplete: () => void;
  onStreamingUpdate: () => void;
}

export default function StreamingText({
  content,
  onStreamingComplete,
  onStreamingUpdate,
}: StreamingTextProps) {
  const [text, setText] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const SPEED_TYPING: number = 100;

  useEffect(() => {
    setText("");
    setIsStreaming(true);
  }, [content]);

  useEffect(() => {
    if (!isStreaming) return;

    const words = content.split(" ");
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < words.length) {
        setText((prev) => {
          const newText = prev + (prev ? " " : "") + words[currentIndex];
          onStreamingUpdate();
          return newText;
        });
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsStreaming(false);
        onStreamingComplete();
      }
    }, SPEED_TYPING);

    return () => clearInterval(intervalId);
  }, [content, onStreamingComplete, onStreamingUpdate, isStreaming]);

  return (
    <div className="prose-sm prose-h1:text-2xl prose-h1:font-semibold prose-p:my-2 lg:prose flex flex-col mx-auto shadow-none p-5 md:p-10 my-10 lg:mb-10 text-start">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
      >
        {`${text}${isStreaming ? '<span class="animate-blink"> |</span>' : ""}`}
      </ReactMarkdown>
    </div>
  );
}
