"use client";

import gsap from "gsap";
import { SignUpButton } from "@clerk/nextjs";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BorderBeam } from "@/components/ui/border-beam";
import { MessageSquareText, Image as ImageIcon, Lightbulb } from "lucide-react";

const features = [
  {
    title: "Chat-native quizzes",
    description:
      "Generate and answer quizzes without ever leaving the chat. No forms, no complex setups.",
    icon: MessageSquareText,
  },
  {
    title: "Image-aware questions",
    description:
      "Attach one image per message so Vquiz can analyze diagrams, screenshots, or code snippets.",
    icon: ImageIcon,
  },
  {
    title: "Smart explanations",
    description:
      "Every wrong answer can show a detailed explanation so you learn why, not just what.",
    icon: Lightbulb,
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".feature-card");

      // Animate Header
      gsap.from(".features-header", {
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-header",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        cards,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 1.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Animate CTA
      gsap.from(".features-cta", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-cta",
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-24 overflow-hidden bg-secondary/75"
    >
      <div className="container relative z-10 flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="features-header text-4xl md:text-5xl font-sentient text-center leading-[1.3] mb-16">
            Everything you need <br />
            <span className="text-primary italic">to master learning</span>
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card bg-muted/10 relative group flex flex-col h-full backdrop-blur-xl rounded-[32px] p-7 border-2 border-white/15 overflow-hidden transition-all duration-500 hover:bg-secondary/30"
            >
              {/* Animated Rotating Border */}
              <BorderBeam
                duration={6}
                delay={i * 2}
                colorFrom="#ffc700"
                borderWidth={2}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/15 mb-5 group-hover:bg-primary/20 transition-all duration-500">
                  <feature.icon className="size-8 text-primary" />
                </div>

                <h3 className="text-3xl md:text-4xl font-sentient mb-6 leading-tight">
                  {feature.title}
                </h3>

                <p className="font-mono text-base text-foreground/60 leading-relaxed mb-10 grow">
                  {feature.description}
                </p>

                <div className="flex items-center gap-4 text-primary font-mono text-sm tracking-widest uppercase mt-auto">
                  <span className="h-px w-12 bg-primary/30 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                  0{i + 1}
                </div>
              </div>

              {/* Hover Glow Background */}
              <div className="absolute -inset-px bg-linear-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="features-cta mt-20 md:mt-24">
          <SignUpButton mode="modal" forceRedirectUrl="/app">
            <Button
              size="sm"
              className="h-16 px-10 font-mono uppercase text-lg"
            >
              Get Started
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
