"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import type { Message } from "@/app/app/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { ChatMessagesSkeleton } from "@/components/chat-skeletons";

type ChatViewProps = {
  messages: Message[];
  chatId: string | null;
  userAvatarUrl?: string;
  lastGeneratedMessageId?: string | null;
  onAnswerQuestion: (questionId: string, choice: "A" | "B" | "C" | "D") => void;
  isTyping?: boolean;
  isLoading?: boolean;
};

export function ChatView({
  messages,
  chatId,
  userAvatarUrl,
  lastGeneratedMessageId,
  onAnswerQuestion,
  isTyping = false,
  isLoading = false,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevMessagesCount = useRef(messages.length);
  const prevIsTyping = useRef(isTyping);
  const prevChatId = useRef(chatId);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const hasMessagesNow = messages.length > 0;
    const hadNoMessages = prevMessagesCount.current === 0;
    const hasInitialMessages = hasMessagesNow && (hadNoMessages || isLoading);

    const hasNewMessage = messages.length > prevMessagesCount.current;
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage?.role === "user";
    const startedTyping = isTyping && !prevIsTyping.current;
    const switchedChat = chatId !== prevChatId.current;

    // Scroll if:
    // 1. A new user message was added
    // 2. The AI just started thinking
    // 3. The user switched to a different chat
    // 4. Initial messages for a chat just loaded (first time messages > 0)
    if (
      (hasNewMessage && isUserMessage) ||
      startedTyping ||
      switchedChat ||
      (hasInitialMessages && switchedChat) ||
      (hasMessagesNow && hadNoMessages && !isLoading)
    ) {
      // Use a small timeout to ensure DOM is rendered
      setTimeout(scrollToBottom, 50);
    }

    prevMessagesCount.current = messages.length;
    prevIsTyping.current = isTyping;
    prevChatId.current = chatId;
  }, [messages, isTyping, isLoading, chatId]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-auto min-h-0 scroll-smooth",
        messages.length === 0 &&
          !isLoading &&
          "flex items-center justify-center",
      )}
    >
      <div ref={contentRef} className="mx-auto max-w-3xl px-4 lg:px-0">
        {isLoading ? (
          <ChatMessagesSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <Image
              src="/robot.png"
              alt="Robot"
              width={120}
              height={120}
              className="pb-5"
            />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start a conversation
            </h3>
            <p className="text-muted/80 max-w-lg">
              Ask me anything or request a quiz on any topic. I can generate{" "}
              <span className="font-semibold text-foreground font-mono">
                MCQs
              </span>
              ,{" "}
              <span className="font-semibold text-foreground font-mono">
                flashcards
              </span>
              , or{" "}
              <span className="font-semibold text-foreground font-mono">
                True/False questions
              </span>{" "}
              for you.
            </p>
            <p className="text-muted-foreground/60 text-sm mt-4 italic">
              Try: &quot;Generate 5 flashcards about React hooks&quot; or
              &quot;Create a True/False quiz on Python basics&quot;
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50 flex flex-col">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                userAvatarUrl={userAvatarUrl}
                isLastGenerated={message._id === lastGeneratedMessageId}
                onAnswerQuestion={onAnswerQuestion}
              />
            ))}
            {isTyping && (
              <div className="pb-[50vh]">
                <TypingIndicator />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
