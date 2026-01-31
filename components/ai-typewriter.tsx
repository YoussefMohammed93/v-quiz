"use client";

import remarkGfm from "remark-gfm";
import ReactMarkdown, { type Components } from "react-markdown";

import { useState, useEffect, useRef } from "react";

interface AITypewriterProps {
  content: string;
  speed?: number;
  components?: Components;
  onFinished?: () => void;
}

export function AITypewriter({
  content,
  speed = 1,
  components,
  onFinished,
}: AITypewriterProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (index < content.length) {
      const nextChar = content[index];

      // Variable speed for a more natural feel
      let currentSpeed = speed;
      if (nextChar === "." || nextChar === "?" || nextChar === "!")
        currentSpeed = speed * 3;
      if (nextChar === "\n") currentSpeed = speed * 2;
      if (nextChar === ",") currentSpeed = speed * 1;

      timeoutRef.current = setTimeout(() => {
        setDisplayedContent((prev: string) => prev + nextChar);
        setIndex((prev: number) => prev + 1);
      }, currentSpeed);
    } else {
      if (onFinished) onFinished();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, content, speed, onFinished]);

  // If the user switches chats or a refresh happens, we might want to skip animation
  // but for simplicity, we start from 0 for "new" messages.
  // In a real app, we might check if message date is very old.

  return (
    <div className="animate-in fade-in duration-500">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
}
