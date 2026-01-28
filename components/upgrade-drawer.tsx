"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: [
      "5 AI messages per day",
      "MCQ quizzes inside chat",
      "1 image per message",
      "Rename and delete chats",
    ],
    cta: "Current Plan",
    recommended: false,
    active: true,
  },
  {
    name: "Basic",
    price: "$1.99",
    features: [
      "50 AI messages per day",
      "Image analysis for questions",
      "Priority quiz generation",
      "Rename and delete chats",
    ],
    cta: "Upgrade to Basic",
    recommended: true,
    active: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    features: [
      "Unlimited AI messages (fair use)",
      "Advanced quiz history & stats",
      "Faster responses & better models",
      "Priority support",
    ],
    cta: "Go Pro",
    recommended: false,
    active: false,
  },
];

type UpgradeDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpgradeDrawer({ open, onOpenChange }: UpgradeDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh] min-h-[80vh] border-border rounded-none bg-secondary">
        <DrawerHeader className="text-center rounded-none">
          <DrawerTitle className="text-2xl md:text-3xl font-sentient mb-2">
            Upgrade your plan
          </DrawerTitle>
          <DrawerDescription className="text-xs md:text-sm text-foreground/50">
            Choose the clear path to mastery. Cancel anytime.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col p-6 bg-muted/10 rounded-xl border border-white/10 transition-all duration-300",
                  plan.recommended
                    ? "border-primary/50 bg-muted/20 shadow-glow shadow-primary/10"
                    : "hover:bg-muted/20",
                )}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-6 md:right-0 transform translate-x-1/3 -translate-y-1/3">
                    <div className="bg-primary text-primary-foreground px-3 py-1 text-[10px] font-mono font-black uppercase tracking-wider rounded-full shadow-lg">
                      Recommended
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-2">
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-sentient font-bold">
                      {plan.price}
                    </span>
                    <span className="text-foreground/40 font-mono text-sm">
                      / month
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mb-6 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-start text-sm text-foreground/80"
                    >
                      <Check className="size-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-tight font-mono">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={
                    plan.active
                      ? "outlineApp"
                      : plan.recommended
                        ? "app"
                        : "outlineApp"
                  }
                  disabled={plan.active}
                  className={cn(
                    "w-full h-10 rounded-lg",
                    plan.recommended &&
                      !plan.active &&
                      "shadow-glow shadow-primary/20",
                  )}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="pt-2 w-full max-w-[150px] mx-auto">
          <DrawerClose asChild className="w-full">
            <Button variant="outlineApp" className="rounded-lg h-12 w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
