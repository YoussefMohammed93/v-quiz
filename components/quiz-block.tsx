"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizBlock as QuizBlockType } from "@/app/app/types";

type QuizBlockProps = {
  quiz: QuizBlockType;
  onAnswerQuestion: (questionId: string, choice: "A" | "B" | "C" | "D") => void;
};

export function QuizBlock({ quiz, onAnswerQuestion }: QuizBlockProps) {
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(
    new Set(),
  );

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  return (
    <div className="rounded-lg border border-border/45 bg-secondary/30 p-4 last:mb-5">
      <div className="mb-4 border-b border-border pb-3">
        <h3 className="text-lg font-semibold text-foreground">{quiz.topic}</h3>
        <p className="text-sm text-muted">
          {quiz.questionCount}{" "}
          {quiz.questionCount === 1 ? "question" : "questions"}
        </p>
      </div>

      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const hasAnswered = question.userAnswer !== undefined;
          const isCorrect = question.userAnswer === question.correctKey;
          const showExplanation = expandedExplanations.has(question.id);

          return (
            <div key={question.id} className="space-y-3">
              <p className="font-medium text-lg text-foreground">
                <span className="mr-2 text-primary">{index + 1}.</span>
                {question.question}
              </p>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = question.userAnswer === option.key;
                  const isCorrectOption = option.key === question.correctKey;

                  const buttonVariant:
                    | "app"
                    | "outline"
                    | "ghost"
                    | "outlineApp" = "outlineApp";
                  let className =
                    "w-full justify-start text-left h-auto py-3 whitespace-normal";

                  if (hasAnswered) {
                    if (isSelected && isCorrect) {
                      className += " bg-green-500/10 border-green-500";
                    } else if (isSelected && !isCorrect) {
                      className += " bg-red-500/10 border-red-500";
                    } else if (isCorrectOption) {
                      className += " border-green-500 bg-green-500/10";
                    }
                  }

                  return (
                    <Button
                      key={option.key}
                      variant={buttonVariant}
                      className={className}
                      onClick={() => {
                        if (!hasAnswered) {
                          onAnswerQuestion(question.id, option.key);
                        }
                      }}
                      disabled={hasAnswered}
                    >
                      <span className="font-mono font-semibold mr-3">
                        {option.key}.
                      </span>
                      <span className="flex-1">{option.text}</span>
                    </Button>
                  );
                })}
              </div>

              {hasAnswered && !isCorrect && (
                <div className="space-y-2">
                  <Button
                    variant="outlineApp"
                    size="sm"
                    onClick={() => toggleExplanation(question.id)}
                    className="text-primary hover:text-primary/80 h-10 rounded-lg"
                  >
                    {showExplanation ? "Hide" : "Show"} explanation
                  </Button>

                  {showExplanation && (
                    <div className="rounded-lg bg-muted/20 border border-border/45 p-3 text-base text-foreground">
                      {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
