"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: "like" | "dislike" | null;
  onSubmit: (rating: "like" | "dislike", comment?: string) => void;
};

export function FeedbackDialog({
  open,
  onOpenChange,
  rating,
  onSubmit,
}: FeedbackDialogProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating) {
      onSubmit(rating, comment);
      onOpenChange(false);
      setComment("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-secondary border-border/40 text-foreground rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-sentient">
            {rating === "like" ? (
              <>
                <ThumbsUp className="size-6 text-primary fill-primary/20" />
                Provide additional feedback
              </>
            ) : (
              <>
                <ThumbsDown className="size-6 text-red-400 fill-red-400/20" />
                What could be better?
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-foreground/50 font-mono text-sm">
            Your feedback helps us improve Vquiz AI for everyone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="comment"
              className="font-mono text-xs uppercase tracking-widest text-foreground/40"
            >
              Optional Comment
            </Label>
            <Textarea
              id="comment"
              placeholder={
                rating === "like"
                  ? "What did you like about this response?"
                  : "Tell us more about why this response wasn't helpful..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none bg-muted/20 border-white/10 focus-visible:ring-primary/50 text-base rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center gap-4">
          <Button
            variant="outlineApp"
            onClick={() => onOpenChange(false)}
            className="h-11 px-5 rounded-none"
          >
            Cancel
          </Button>
          <Button
            variant="app"
            onClick={handleSubmit}
            className="h-11 px-5 rounded-none"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
