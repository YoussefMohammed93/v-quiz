"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type MessageComposerProps = {
  onSend: (payload: { text: string; imageFile?: File | null }) => void;
  isSending?: boolean;
  dailyUsed: number;
  dailyLimit: number;
  onUpgrade: () => void;
};

export function MessageComposer({
  onSend,
  isSending = false,
  dailyUsed,
  dailyLimit,
  onUpgrade,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLimitReached = dailyUsed >= dailyLimit;
  const canSend =
    (text.trim() || selectedImage) && !isLimitReached && !isSending;

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
      imageFile: selectedImage,
    });

    setText("");
    setSelectedImage(null);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="p-2 md:p-[11px]">
      <div className="mx-auto max-w-3xl">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 w-fit">
            <Paperclip className="size-4 text-muted" />
            <span className="text-sm text-foreground">
              {selectedImage.name}
            </span>
            <button
              onClick={removeImage}
              className="ml-2 text-muted hover:text-foreground rounded-lg"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className={cn(
                "min-h-[56px] pl-4 md:pl-5 pr-12 md:pr-14 max-h-[200px] resize-none text-base md:text-xl pt-3.5 bg-secondary/30 outline-none ring-none focus:ring-0 border-border rounded-[28px] overflow-hidden wrap-break-word placeholder:text-muted",
                isLimitReached && "opacity-50",
              )}
              disabled={isLimitReached || isSending}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLimitReached || isSending}
              className="absolute disabled:hover:bg-transparent disabled:hover:text-muted cursor-pointer right-3 bottom-[9.5px] text-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/25 p-2 rounded-full"
            >
              <Paperclip className="size-5" />
            </button>
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

        {isLimitReached ? (
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
        )}
      </div>
    </div>
  );
}
