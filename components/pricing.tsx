"use client";

import gsap from "gsap";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PricingBackground } from "./pricing-bg";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    cta: "Start for free",
    recommended: false,
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
  },
];

export function Pricing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const router = useRouter();

  const handlePlanClick = (planName: string) => {
    // Convert display name "Basic" -> "basic"
    const planKey = planName.toLowerCase();

    if (!userId) {
      router.push(`/app/payment?plan=${planKey}`);
    } else {
      router.push(`/app/payment?plan=${planKey}`);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading Animation
      gsap.fromTo(
        ".pricing-heading",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".pricing-heading",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Plans Animation
      gsap.fromTo(
        ".pricing-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".pricing-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Footer Items Animation
      gsap.fromTo(
        ".pricing-footer-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".pricing-footer",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="py-32 relative overflow-hidden"
    >
      <PricingBackground />

      <div className="container relative z-10">
        <h2 className="pricing-heading text-4xl md:text-6xl font-sentient text-center mb-24">
          Simple, <i className="font-light text-primary">affordable</i> pricing
        </h2>

        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={cn(
                "pricing-card relative flex flex-col p-10 bg-muted/20 backdrop-blur-xl border border-white/10 group transition-all duration-500 hover:bg-muted/15",
                "[clip-path:polygon(24px_0,100%_0,100%_calc(100%_-_24px),calc(100%_-_24px)_100%,0_100%,0_24px)]",
                plan.recommended
                  ? "border-primary/50 shadow-glow shadow-primary/20 relative md:-top-5 z-10"
                  : "hover:border-primary/30",
              )}
            >
              {plan.recommended && (
                <div className="absolute top-12 right-10 md:right-6 transform -translate-y-1/2 z-40">
                  <div className="bg-primary text-primary-foreground px-4 py-1 text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-sm -skew-x-12 shadow-lg">
                    <span className="block skew-x-12">RECOMMENDED</span>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="font-mono text-sm text-foreground/40 uppercase tracking-widest mb-4 group-hover:text-primary transition-colors">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-sentient font-bold">
                    {plan.price}
                  </span>
                  <span className="text-foreground/40 font-mono">/ month</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-center text-sm font-mono text-foreground/60 group-hover:text-foreground/100 transition-colors"
                  >
                    <Check className="size-4 text-primary shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                variant={plan.recommended ? "default" : "outline"}
                className="w-full h-14 group-hover:shadow-glow group-hover:shadow-primary/20 transition-all duration-500"
                onClick={() => handlePlanClick(plan.name)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="pricing-footer flex flex-wrap justify-center gap-x-8 gap-y-4 mt-16 text-xs font-mono text-foreground/75">
          <span className="pricing-footer-item">Prices in USD</span>
          <span className="pricing-footer-item text-primary text-[13px] self-center">
            •
          </span>
          <span className="pricing-footer-item">Cancel anytime</span>
          <span className="pricing-footer-item text-primary text-[13px] self-center">
            •
          </span>
          <span className="pricing-footer-item">Secure Payment</span>
        </div>
      </div>
    </section>
  );
}
