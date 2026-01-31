"use client";

import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import type { FlashcardBlock as FlashcardBlockType } from "@/app/app/types";

type FlashcardBlockProps = {
  flashcards: FlashcardBlockType;
};

export function FlashcardBlock({ flashcards }: FlashcardBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards.cards[currentIndex];
  const totalCards = flashcards.cards.length;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
    }, 150);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const MarkdownComponents = {
    strong: ({ ...props }) => (
      <strong className="font-bold text-primary" {...props} />
    ),
    code: ({ ...props }) => (
      <code
        className="bg-red-400/10 text-red-400 px-1.5 py-0.5 rounded text-[0.9em] font-mono"
        {...props}
      />
    ),
    p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
    h1: ({ ...props }) => (
      <h1 className="text-xl font-black text-primary mb-2" {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className="text-lg font-bold text-primary mb-2" {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className="text-md font-bold text-primary mb-1" {...props} />
    ),
  };

  return (
    <div className="mt-4 space-y-4 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xl sm:text-2xl font-mono font-semibold text-foreground">
          {flashcards.topic}
        </h3>
        <span className="text-sm font-medium text-muted bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>
      {/* Flashcard Container with 3D Flip */}
      <div
        className="relative h-72 md:h-80 w-full cursor-pointer perspective-1000 group"
        onClick={toggleFlip}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-500 preserve-3d",
            isFlipped ? "rotate-y-180" : "",
          )}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-secondary/60 border border-border/50 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-xl transition-colors">
            <span className="absolute top-5 left-6 text-xs font-bold font-mono text-muted uppercase tracking-[0.2em]">
              Front
            </span>
            <div className="text-2xl md:text-3xl font-medium text-foreground tracking-tight max-w-2xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {currentCard.front}
              </ReactMarkdown>
            </div>
            <div className="absolute bottom-6 right-6 text-muted group-hover:text-primary transition-colors">
              <RotateCw className="size-5" />
            </div>
          </div>
          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-primary/5 border border-primary/15 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 text-center shadow-xl">
            <span className="absolute top-5 left-6 text-xs font-bold font-mono text-primary/70 uppercase tracking-[0.2em]">
              Back
            </span>
            <div className="text-lg md:text-xl font-medium text-foreground/90 leading-relaxed max-w-2xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {currentCard.back}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outlineApp"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={totalCards <= 1}
          className="rounded-full size-12"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          variant="app"
          className="px-6 rounded-full h-12"
          onClick={(e) => {
            e.stopPropagation();
            toggleFlip();
          }}
        >
          {isFlipped ? "See Question" : "See Answer"}
        </Button>
        <Button
          variant="outlineApp"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={totalCards <= 1}
          className="rounded-full size-12"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
      <p className="text-center text-xs text-muted">
        Click the card or the button below to flip
      </p>
    </div>
  );
}
