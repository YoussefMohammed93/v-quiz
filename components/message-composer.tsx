"use client";

import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatInputSkeleton } from "@/components/chat-skeletons";

type MessageComposerProps = {
  onSend: (payload: { text: string }) => void;
  isSending?: boolean;
  dailyUsed: number;
  dailyLimit: number;
  onUpgrade: () => void;
  plan?: string;
  isLoading?: boolean;
};

export function MessageComposer({
  onSend,
  isSending = false,
  dailyUsed,
  dailyLimit,
  onUpgrade,
  plan,
  isLoading = false,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isPro = plan === "pro";
  const isLimitReached = !isPro && dailyUsed >= dailyLimit;
  const canSend = text.trim() && !isLimitReached && !isSending;

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    if (!canSend) return;

    onSend({
      text: text.trim(),
    });

    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return <ChatInputSkeleton />;
  }

  return (
    <div className="p-2 md:p-[11px]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className={cn(
                "min-h-[56px] pl-4 md:pl-5 pr-4 md:pr-5 max-h-[200px] resize-none text-base md:text-xl pt-3.5 bg-secondary/30 outline-none ring-none focus:ring-0 border-border rounded-[28px] overflow-hidden wrap-break-word placeholder:text-muted",
                isLimitReached && "opacity-50",
              )}
              disabled={isLimitReached || isSending}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!canSend}
            size="icon"
            variant="app"
            className="size-12 md:size-14 shrink-0 rounded-full"
          >
            <Send className="size-5" />
          </Button>
        </div>
        {!isPro &&
          (isLimitReached ? (
            <p className="mt-2 ml-1 text-sm text-muted">
              Daily limit reached.{" "}
              <button
                onClick={onUpgrade}
                className="text-primary cursor-pointer hover:underline"
              >
                Upgrade to continue
              </button>
            </p>
          ) : (
            <p className="mt-2 ml-1 text-sm text-muted">
              Messages used today: {dailyUsed} of {dailyLimit}
            </p>
          ))}
      </div>
    </div>
  );
}
