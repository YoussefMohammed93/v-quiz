import * as React from "react";

import { px } from "../utils";
import { cn } from "@/lib/utils";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex relative uppercase border font-mono cursor-pointer items-center font-medium has-[>svg]:px-3 justify-center gap-2 whitespace-nowrap font-medium ease-out transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_0,100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,0_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]",
  {
    variants: {
      variant: {
        app: "bg-primary border-primary text-primary-foreground hover:bg-primary/80 hover:shadow-primary/40 [clip-path:none]",
        default:
          "bg-primary border-primary text-primary-foreground [&>[data-border]]:bg-primary-foreground/30 [box-shadow:0_0_20px_0px_rgba(255,199,0,0.2)] hover:bg-primary/90 hover:shadow-primary/40",
        ghost:
          "border-transparent bg-transparent hover:bg-secondary hover:text-foreground [&>[data-border]]:hidden",
        outline:
          "border-primary bg-secondary/50 text-foreground hover:bg-secondary [&>[data-border]]:bg-primary",
        outlineApp:
          "border border-border/45 bg-muted/15 text-foreground hover:bg-muted/25 [clip-path:none]",
        link: "text-primary underline-offset-4 hover:underline border-none bg-transparent [&>[data-border]]:hidden",
      },
      size: {
        default: "h-16 px-6 text-base",
        sm: "h-14 px-6 text-sm",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  const polyRoundness = 16;
  const hypotenuse = polyRoundness * 2;
  const hypotenuseHalf = polyRoundness / 2 - 1.5;

  return (
    <Comp
      style={
        {
          "--poly-roundness": px(polyRoundness),
        } as React.CSSProperties
      }
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span
        data-border="top-left"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[2px] -rotate-45 origin-top -translate-x-1/2"
      />
      <span
        data-border="bottom-right"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[2px] -rotate-45 translate-x-1/2"
      />

      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Button, buttonVariants };
