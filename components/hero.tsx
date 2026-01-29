"use client";

import gsap from "gsap";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

import { GL } from "./gl";
import { Pill } from "./pill";
import { Button } from "./ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useState, useRef, useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".gsap-reveal", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="flex flex-col min-h-svh justify-center items-center relative overflow-hidden text-center"
    >
      {/* Background GL animation restricted to hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GL hovering={hovering} />
      </div>

      <div className="container relative z-10 pt-32 pb-16 flex flex-col items-center px-6">
        <Pill className="mb-6 gsap-reveal scale-90 sm:scale-100">
          AI‑POWERED QUIZ & CHAT
        </Pill>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-sentient mb-20 gsap-reveal tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Turn any topic into <br className="hidden sm:block" />
          <i className="font-light text-primary">interactive</i> AI quizzes.
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 gsap-reveal w-full sm:w-auto">
          <SignUpButton mode="modal" forceRedirectUrl="/app">
            <Button
              className="w-full sm:w-auto hover:bg-primary/90 transition-all duration-300"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              Start for free
            </Button>
          </SignUpButton>
          <Link href="/#demo" className="w-full sm:w-auto">
            <Button
              variant="link"
              className="w-full sm:w-auto text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              See Vquiz in action →
            </Button>
          </Link>
        </div>

        <div className="mt-12 gsap-reveal">
          <p className="text-xs font-mono text-foreground/30 flex items-center gap-2">
            <span className="size-1 bg-primary rounded-full animate-pulse" />
            <span className="hidden sm:block">No credit card required ·</span> 5
            free AI chats per day
          </p>
        </div>
      </div>
    </div>
  );
}
