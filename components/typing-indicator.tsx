"use client";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-muted/25 rounded-2xl w-fit ml-1 mb-4">
      <span className="text-base font-mono font-semibold text-foreground">
        Vquiz AI is thinking
      </span>
      <div className="flex items-center gap-1.5">
        <div className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <div className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <div className="size-2 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
