"use client";

import gsap from "gsap";

import { useRef, useEffect } from "react";
import { MessageSquare, Zap, BookOpen } from "lucide-react";

const steps = [
  {
    title: "Ask in chat",
    description:
      'Type a simple prompt like "Make 5 flashcards about React" or "Create a True/False quiz on Python basics."',
    icon: MessageSquare,
  },
  {
    title: "Instant Generation",
    description:
      "Vquiz instantly turns your topic into interactive MCQs, flashcards, or True/False challenges right in the chat.",
    icon: Zap,
  },
  {
    title: "Answer & learn",
    description:
      "Interact with your quiz, get instant feedback, and reveal smart explanations to master any topic faster.",
    icon: BookOpen,
  },
];

import { HowItWorksBG } from "./how-it-works-bg";

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".how-step-panel");

      const mainTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
            ease: "power1.inOut",
          },
          end: () => "+=" + containerRef.current!.offsetWidth * 1.5,
        },
      });

      // Animate internal elements for each panel
      panels.forEach((panel) => {
        const icon = panel.querySelector(".step-icon");
        const title = panel.querySelector(".step-title");
        const desc = panel.querySelector(".step-desc");

        // Reveal content as it centers - sliding from left to right
        gsap.fromTo(
          [icon, title, desc],
          {
            x: -100,
            opacity: 0,
            scale: 0.9,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: mainTween,
              start: "left center",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="overflow-hidden bg-[#0a0a0a] relative"
    >
      <HowItWorksBG />
      <div
        ref={horizontalRef}
        className="bg-secondary/65 flex h-screen w-[300%] relative z-10"
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className="how-step-panel w-screen h-screen shrink-0 flex items-center justify-center p-6 md:p-24 relative"
          >
            <div className="container max-w-5xl relative z-10 flex flex-col items-center text-center space-y-6 pt-20">
              <div className="step-icon size-20 bg-primary/10 rounded-[100px] flex items-center justify-center border border-primary/15 backdrop-blur-md">
                <step.icon className="size-10 text-primary" />
              </div>

              <div className="space-y-6">
                <h2 className="step-title text-4xl md:text-8xl font-sentient leading-[1.1] tracking-tight">
                  {i === 0 && "How Vquiz Works"}
                  {i > 0 && step.title.split(" ")[0]} <br />
                  <i className="font-light text-primary">
                    {i === 0
                      ? step.title
                      : step.title.split(" ").slice(1).join(" ")}
                  </i>
                </h2>
                <p className="step-desc font-mono text-xl md:text-2xl text-foreground/60 leading-relaxed max-w-3xl mx-auto px-4">
                  {step.description}
                </p>
              </div>

              <div className="flex items-center gap-6 text-primary font-mono text-base tracking-[0.2em] uppercase pt-4">
                <span className="h-px w-16 bg-primary/30" />
                Step 0{i + 1} / 03
                <span className="h-px w-16 bg-primary/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
