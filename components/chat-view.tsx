"use client";

import Image from "next/image";

import { useEffect, useRef } from "react";
import type { Message } from "@/app/app/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

type ChatViewProps = {
  messages: Message[];
  onAnswerQuestion: (questionId: string, choice: "A" | "B" | "C" | "D") => void;
  isTyping?: boolean;
};

export function ChatView({
  messages,
  onAnswerQuestion,
  isTyping = false,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto min-h-0 scroll-smooth"
    >
      <div ref={contentRef} className="mx-auto max-w-3xl px-4 md:px-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <Image
              src="/robot.png"
              alt="Robot"
              width={100}
              height={100}
              className="pb-5"
            />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start a conversation
            </h3>
            <p className="text-muted max-w-md">
              Ask me anything or request a quiz on any topic. Try saying
              &quot;Generate 5 MCQs about JavaScript&quot;
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onAnswerQuestion={onAnswerQuestion}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>
    </div>
  );
}
