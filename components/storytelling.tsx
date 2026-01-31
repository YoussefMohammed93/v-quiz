"use client";

import gsap from "gsap";

import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderBeam } from "@/components/ui/border-beam";

const slides = [
  {
    title: "Start a new chat",
    text: "Open a new chat on any topic and tell the AI what you want to learn today.",
    icon: "01",
  },
  {
    title: "Pick your format",
    text: "Choose between MCQs, Flashcards, or True/False challenges tailored to your material.",
    icon: "02",
  },
  {
    title: "Answer with feedback",
    text: "Get instant results with clear explanations that help you master the material faster.",
    icon: "03",
  },
  {
    title: "Review your progress",
    text: "Track your accuracy and review past attempts to see how much you've improved.",
    icon: "04",
  },
];

export function Storytelling() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".story-card");

      // Animate Header
      gsap.from(".story-header", {
        opacity: 0,
        y: 40,
        duration: 3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-header",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          {
            opacity: 0,
            y: 100,
            scale: 0.9,
            rotateX: 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="product"
      className="py-24 bg-secondary/65 relative overflow-hidden"
      ref={containerRef}
    >
      <div className="container relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <h2 className="story-header text-4xl md:text-5xl font-sentient text-center leading-[1.3]">
            The learning flow <br />
            <span className="text-primary italic">reimagined</span>
          </h2>
        </div>

        {/* Narrative Cards */}
        <div className="w-full max-w-4xl space-y-14">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="story-card relative group p-8 md:p-16 rounded-[45px] bg-muted/5 backdrop-blur-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row gap-12 items-center transition-colors duration-500 hover:bg-muted/10"
            >
              {/* Border Beam */}
              <BorderBeam
                duration={10}
                delay={i * 4}
                colorFrom="#ffc700"
                borderWidth={2}
              />

              {/* Massive Background Number */}
              <div className="absolute -right-8 -bottom-20 md:-right-4 md:-bottom-24 text-[12rem] md:text-[20rem] font-sentient font-bold text-primary/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-700">
                {slide.icon}
              </div>

              {/* Content Side */}
              <div className="relative z-10 space-y-6 text-center md:text-left">
                <h3 className="text-3xl md:text-5xl font-sentient leading-tight">
                  {slide.title}
                </h3>
                <p className="font-mono text-lg md:text-xl text-foreground/60 leading-relaxed max-w-2xl">
                  {slide.text}
                </p>
              </div>

              {/* Subtle hover decorations */}
              <div className="absolute top-0 right-0 p-8 text-primary/0 group-hover:text-primary/20 transition-all duration-700">
                <div className="size-2 rounded-full bg-current animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
