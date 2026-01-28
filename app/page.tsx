"use client";

import { Leva } from "leva";
import { FAQ } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Storytelling } from "@/components/storytelling";

export default function Home() {
  return (
    <>
      <main className="relative bg-background">
        <Hero />
        <HowItWorks />
        <Storytelling />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Leva hidden />
    </>
  );
}
