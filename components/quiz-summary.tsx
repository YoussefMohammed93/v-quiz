"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Trophy, Target } from "lucide-react";

type QuizSummaryProps = {
  data: {
    correct: number;
    total: number;
    score: number;
    topic: string;
  };
};

export function QuizSummary({ data }: QuizSummaryProps) {
  const isExcellent = data.score >= 80;
  const isGood = data.score >= 50 && data.score < 80;

  return (
    <div className="mt-4 rounded-2xl overflow-hidden border border-border/45 bg-secondary/30 relative max-w-sm">
      <div
        className={cn(
          "h-16 flex items-center justify-center relative overflow-hidden bg-muted/15",
        )}
      >
        <Trophy
          className={cn(
            "size-8",
            isExcellent
              ? "text-yellow-500"
              : isGood
                ? "text-blue-400"
                : "text-muted",
          )}
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-foreground mb-2">
          Quiz Completed!
        </h3>
        <p className="text-muted text-base mb-4 truncate px-2">{data.topic}</p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="size-14 rounded-lg bg-green-500/10 flex items-center justify-center mb-1.5">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <span className="text-base font-bold text-foreground">
              {data.correct}
            </span>
            <span className="text-sm text-muted uppercase tracking-wider">
              Correct
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center mb-1.5">
              <Target className="size-8 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">
              {data.total}
            </span>
            <span className="text-sm text-muted uppercase tracking-wider">
              Total
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="size-14 rounded-lg bg-orange-500/10 flex items-center justify-center mb-1.5">
              <span className="text-2xl font-bold text-orange-500">%</span>
            </div>
            <span className="text-base font-bold text-foreground">
              {data.score}%
            </span>
            <span className="text-sm text-muted uppercase tracking-wider">
              Score
            </span>
          </div>
        </div>

        <div className="relative h-2 w-full bg-muted/20 rounded-full overflow-hidden mb-1">
          <div
            className={cn(
              "absolute top-0 left-0 h-full transition-all duration-1000 ease-out",
              isExcellent
                ? "bg-yellow-500"
                : isGood
                  ? "bg-blue-500"
                  : "bg-primary",
            )}
            style={{ width: `${data.score}%` }}
          />
        </div>

        <p className="text-base font-medium text-muted mt-3 italic opacity-80">
          {isExcellent
            ? "Outstanding performance! You're a master."
            : isGood
              ? "Great job! You have a solid understanding."
              : "Keep practicing! You'll get better every time."}
        </p>
      </div>
    </div>
  );
}
