"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const faqs = [
  {
    q: "What is Vquiz?",
    a: "Vquiz is an AI-powered quiz and chat app that turns any topic into interactive multiple-choice questions right inside a chat interface.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No! You can start for free with 5 AI messages per day. No credit card required.",
  },
  {
    q: "How many AI messages do I get on the Free plan?",
    a: "You get 5 messages per day on the Free plan. Messages reset every 24 hours.",
  },
  {
    q: "Can I generate quizzes for any subject?",
    a: "Yes. Vquiz uses advanced AI models that can handle topics from coding and biology to history and business.",
  },
  {
    q: "Can I upload images with my questions?",
    a: "Yes. You can upload one image per message (diagrams, screenshots, etc.) and the AI will analyze it to help generate questions or explanations.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use Clerk for secure authentication and follow industry best practices to protect your data.",
  },
];

export function FAQ() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading Animation
      gsap.fromTo(
        ".faq-heading",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-heading",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Accordion Items Animation
      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".faq-accordion",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="faq"
      ref={containerRef}
      className="py-24 relative bg-secondary/65"
    >
      <div className="container max-w-3xl">
        <h2 className="faq-heading text-4xl md:text-5xl font-sentient text-center mb-16">
          Frequently asked <i className="font-light text-primary">questions</i>
        </h2>

        <Accordion type="single" collapsible className="faq-accordion w-full">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="faq-item border-border/5"
            >
              <AccordionTrigger className="cursor-pointer text-left font-sentient text-lg hover:text-primary transition-colors py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-mono text-foreground/60 leading-relaxed pb-6 text-sm">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
