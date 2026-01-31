"use client";

import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { QuizBlock } from "./quiz-block";
import { CodeBlock } from "./code-block";
import ReactMarkdown from "react-markdown";
import { QuizSummary } from "./quiz-summary";
import type { Message } from "@/app/app/types";
import { FlashcardBlock } from "./flashcard-block";
import { TypingIndicator } from "./typing-indicator";
import { formatMessageTime } from "@/lib/format-timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MessageBubbleProps = {
  message: Message;
  userAvatarUrl?: string; // Added user avatar URL
  onAnswerQuestion: (questionId: string, choice: "A" | "B" | "C" | "D") => void;
};

export function MessageBubble({
  message,
  userAvatarUrl, // Destructured
  onAnswerQuestion,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-4 md:flex md:gap-4 last:mb-0 px-4 md:pr-0! py-6 first:mt-5",
        isUser
          ? "bg-muted/10 rounded-3xl pb-0 border border-muted/15"
          : "px-0 md:px-4 bg-transparent pb-0 last:pb-5 mb-5",
      )}
    >
      <Avatar className="size-10 shrink-0">
        {!isUser ? (
          <AvatarImage src="/logo.svg" alt="Vquiz" className="object-cover" />
        ) : (
          userAvatarUrl && (
            <AvatarImage
              src={userAvatarUrl}
              alt="User"
              className="object-cover"
            />
          )
        )}

        <AvatarFallback
          className={cn(
            "font-semibold",
            isUser
              ? "bg-white text-primary-foreground"
              : "bg-foreground text-background",
          )}
        >
          {isUser ? "U" : "V"}
        </AvatarFallback>
      </Avatar>

      <div className="contents md:block md:flex-1 md:min-w-0">
        <div className="flex items-center gap-2 mb-1 md:mb-0.5 col-start-2 self-center">
          <span className="font-semibold text-foreground">
            {isUser ? "You" : "Vquiz AI"}
          </span>
          <span className="text-xs text-muted mt-0.5">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>

        <div className="col-span-2 md:col-auto mt-2 md:mt-0">
          {message.isStreaming ? (
            <TypingIndicator />
          ) : (
            <>
              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none text-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Headings with gradient colors and proper sizing
                    h1: ({ ...props }) => (
                      <h1
                        className="text-3xl font-bold font-mono mb-4 mt-6 text-foreground"
                        {...props}
                      />
                    ),
                    h2: ({ ...props }) => (
                      <h2
                        className="text-2xl font-bold font-mono mb-3 mt-5 text-foreground"
                        {...props}
                      />
                    ),
                    h3: ({ ...props }) => (
                      <h3
                        className="text-xl font-semibold font-mono mb-2 mt-4 text-foreground"
                        {...props}
                      />
                    ),
                    // Paragraphs with better spacing
                    p: ({ ...props }) => (
                      <p
                        className="mb-4 leading-7 text-foreground/70"
                        {...props}
                      />
                    ),
                    // Unordered lists with custom bullets
                    ul: ({ ...props }) => (
                      <ul
                        className="mb-4 ml-6 space-y-2 list-none text-foreground/70"
                        {...props}
                      />
                    ),
                    // Ordered lists
                    ol: ({ ...props }) => (
                      <ol
                        className="mb-4 ml-6 space-y-2 list-decimal list-outside text-foreground/70"
                        {...props}
                      />
                    ),
                    // List items with custom styling
                    li: ({ ...props }) => (
                      <li
                        className="pl-2 relative before:content-['•'] before:absolute before:-left-4 before:text-primary before:font-bold before:text-lg"
                        {...props}
                      />
                    ),
                    // Bold text with color
                    strong: ({ ...props }) => (
                      <strong
                        className="font-medium text-lg text-primary/90"
                        {...props}
                      />
                    ),
                    // Italic/emphasis
                    em: ({ ...props }) => (
                      <em className="italic text-blue-200" {...props} />
                    ),
                    // Inline code with better styling
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isCodeBlock = match && match[1];

                      if (isCodeBlock) {
                        return (
                          <CodeBlock
                            language={match[1]}
                            value={String(children).replace(/\n$/, "")}
                            {...props}
                          />
                        );
                      }
                      // Inline code
                      return (
                        <code
                          className="bg-red-400/10 text-red-400 px-1.5 py-[3.5px] rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    // Pre tag - just pass through
                    pre: ({ children }) => {
                      return <>{children}</>;
                    },
                    // Links with accent color
                    a: ({ ...props }) => (
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-400/80 underline font-medium transition-colors"
                        {...props}
                      />
                    ),
                    // Blockquotes
                    blockquote: ({ ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary/50 pl-4 italic text-muted my-4"
                        {...props}
                      />
                    ),
                    // Tables
                    table: ({ ...props }) => (
                      <div className="my-6 w-full overflow-y-auto rounded-lg border border-border/50">
                        <table
                          className="w-full text-left text-sm"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ ...props }) => (
                      <thead
                        className="bg-muted/30 text-foreground font-medium border-b border-border/50"
                        {...props}
                      />
                    ),
                    tbody: ({ ...props }) => (
                      <tbody className="divide-y divide-border/30" {...props} />
                    ),
                    tr: ({ ...props }) => (
                      <tr
                        className="transition-colors hover:bg-muted/10 group"
                        {...props}
                      />
                    ),
                    th: ({ ...props }) => (
                      <th
                        className="px-4 py-3 font-semibold text-foreground whitespace-nowrap"
                        {...props}
                      />
                    ),
                    td: ({ ...props }) => (
                      <td className="px-4 py-3 align-top" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {message.quiz && (
                <QuizBlock
                  quiz={message.quiz}
                  onAnswerQuestion={onAnswerQuestion}
                />
              )}

              {message.flashcards && (
                <FlashcardBlock flashcards={message.flashcards} />
              )}

              {message.isSummary && message.summaryData && (
                <QuizSummary data={message.summaryData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
