"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { QuizBlock } from "./quiz-block";
import { QuizSummary } from "./quiz-summary";
import type { Message } from "@/app/app/types";
import { TypingIndicator } from "./typing-indicator";
import { formatMessageTime } from "@/lib/format-timestamp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MessageBubbleProps = {
  message: Message;
  onAnswerQuestion: (questionId: string, choice: "A" | "B" | "C" | "D") => void;
};

export function MessageBubble({
  message,
  onAnswerQuestion,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-4 md:flex md:gap-4 mb-5 last:mb-0 px-4 md:!pr-0 py-6 first:mt-5",
        isUser ? "bg-muted/15 rounded-2xl" : "px-0 md:px-4 bg-transparent",
      )}
    >
      <Avatar className="size-10 shrink-0">
        {!isUser && <AvatarImage src="/logo.svg" alt="Vquiz" />}

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
            {isUser ? "You" : "Vquiz"}
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
              <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap">
                {message.content}
              </div>

              {message.imageUrl && (
                <div className="mt-3 max-w-md w-full">
                  <Image
                    src={message.imageUrl}
                    alt="Uploaded image"
                    width={400}
                    height={300}
                    className="rounded-lg border border-border/45 w-full h-auto"
                  />
                </div>
              )}

              {message.quiz && (
                <QuizBlock
                  quiz={message.quiz}
                  onAnswerQuestion={onAnswerQuestion}
                />
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
