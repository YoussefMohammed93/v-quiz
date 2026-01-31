"use client";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import {
  Check,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TrueFalseQuizBlock as TrueFalseQuizBlockType } from "@/app/app/types";

type TrueFalseBlockProps = {
  trueFalseQuiz: TrueFalseQuizBlockType;
};

export function TrueFalseBlock({ trueFalseQuiz }: TrueFalseBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<
    Record<string, boolean>
  >({});

  const currentQuestion = trueFalseQuiz.questions[currentIndex];
  const totalQuestions = trueFalseQuiz.questions.length;
  const userAnswer = answers[currentQuestion.id];
  const isSelected = userAnswer !== undefined;
  const isCorrect = isSelected && userAnswer === currentQuestion.correctAnswer;
  const isWrong = isSelected && userAnswer !== currentQuestion.correctAnswer;

  const handleAnswer = (answer: boolean) => {
    if (isSelected) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
    if (answer !== currentQuestion.correctAnswer) {
      setShowExplanation((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
  };

  const completedCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([id, ans]) =>
      ans === trueFalseQuiz.questions.find((q) => q.id === id)?.correctAnswer,
  ).length;

  const MarkdownComponents = {
    strong: ({ ...props }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-primary" {...props} />
    ),
    code: ({ ...props }: { children?: React.ReactNode }) => (
      <code
        className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[0.9em] font-mono"
        {...props}
      />
    ),
    p: ({ ...props }: { children?: React.ReactNode }) => (
      <p className="leading-relaxed" {...props} />
    ),
  };

  return (
    <div className="mt-4 space-y-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {trueFalseQuiz.topic}
          </h3>
          <p className="text-sm text-muted">True or False Quiz</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-muted bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      <div className="bg-secondary/30 border border-border/50 rounded-2xl p-6 md:p-8 min-h-64 flex flex-col justify-between shadow-sm relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          <div className="text-xl md:text-2xl font-medium text-foreground text-center py-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {currentQuestion.question}
            </ReactMarkdown>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Button
              variant="outline"
              className={cn(
                "h-16 text-lg font-bold border-2 transition-all duration-200 [clip-path:none] [&_span]:hidden",
                isSelected &&
                  currentQuestion.correctAnswer === true &&
                  "border-green-500 bg-green-500/10 text-green-500",
                isSelected &&
                  userAnswer === true &&
                  currentQuestion.correctAnswer === false &&
                  "border-red-500 bg-red-500/10 text-red-500 opacity-70",
                !isSelected && "hover:border-primary hover:bg-primary/5",
                userAnswer === true && "border-primary bg-primary/10",
              )}
              onClick={() => handleAnswer(true)}
              disabled={isSelected}
            >
              {isSelected && currentQuestion.correctAnswer === true && (
                <Check className="size-6" />
              )}
              {isSelected &&
                userAnswer === true &&
                currentQuestion.correctAnswer === false && (
                  <X className="size-6" />
                )}
              True
            </Button>

            <Button
              variant="outline"
              className={cn(
                "h-16 text-lg font-bold border-2 transition-all duration-200 [clip-path:none] [&_span]:hidden",
                isSelected &&
                  currentQuestion.correctAnswer === false &&
                  "border-green-500 bg-green-500/10 text-green-500",
                isSelected &&
                  userAnswer === false &&
                  currentQuestion.correctAnswer === true &&
                  "border-red-500 bg-red-500/10 text-red-500 opacity-70",
                !isSelected && "hover:border-primary hover:bg-primary/5",
                userAnswer === false && "border-primary bg-primary/10",
              )}
              onClick={() => handleAnswer(false)}
              disabled={isSelected}
            >
              {isSelected && currentQuestion.correctAnswer === false && (
                <Check className="size-6" />
              )}
              {isSelected &&
                userAnswer === false &&
                currentQuestion.correctAnswer === true && (
                  <X className="size-6" />
                )}
              False
            </Button>
          </div>

          {isSelected && (
            <div
              className={cn(
                "p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300",
                isCorrect
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-red-500/5 border-red-400/20",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 p-1 rounded-full",
                    isCorrect
                      ? "bg-green-500/20 text-green-500"
                      : "bg-red-400/20 text-red-400",
                  )}
                >
                  {isCorrect ? (
                    <Check className="size-4" />
                  ) : (
                    <X className="size-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-bold mb-1",
                      isCorrect ? "text-green-500" : "text-red-400",
                    )}
                  >
                    {isCorrect ? "Correct!" : "Actually, that's False."}
                  </p>
                  {(isWrong || showExplanation[currentQuestion.id]) && (
                    <div className="text-sm text-foreground/80 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                      >
                        {currentQuestion.explanation}
                      </ReactMarkdown>
                    </div>
                  )}
                  {isCorrect && !showExplanation[currentQuestion.id] && (
                    <Button
                      variant="outlineApp"
                      className="h-9 my-2 text-sm rounded-lg"
                      onClick={() =>
                        setShowExplanation((prev) => ({
                          ...prev,
                          [currentQuestion.id]: true,
                        }))
                      }
                    >
                      <Info className="size-5" />
                      Show Explanation
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant="outlineApp"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="rounded-full size-10"
          >
            <ChevronLeft className="size-5" />
          </Button>

          <Button
            variant="outlineApp"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === totalQuestions - 1 || !isSelected}
            className="rounded-full size-10"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>

        {completedCount === totalQuestions ? (
          <Button
            variant="app"
            onClick={resetQuiz}
            className="rounded-full h-10 px-6"
          >
            <RotateCcw className="size-4" />
            Try Again
          </Button>
        ) : (
          <p className="text-xs text-muted">
            {isSelected
              ? "Great! Move to the next question."
              : "Select True or False to continue."}
          </p>
        )}
      </div>

      {completedCount === totalQuestions && (
        <div className="text-center pt-2">
          <p className="text-lg font-bold text-primary animate-in zoom-in duration-500">
            Quiz Complete! Your Score: {correctCount}/{totalQuestions}
          </p>
        </div>
      )}
    </div>
  );
}
