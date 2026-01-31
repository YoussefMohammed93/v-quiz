"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  value: string;
  className?: string;
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard", error);
    }
  };

  return (
    <div
      className={cn(
        "my-4 rounded-xl overflow-hidden border border-border/50 bg-[#191919]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-white/10">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <Check className="size-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <div className="text-sm font-mono overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1.5rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.5",
          }}
          wrapLines={true}
          wrapLongLines={true}
          PreTag="div"
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
