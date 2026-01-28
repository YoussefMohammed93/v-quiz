"use client";

import { Leva } from "leva";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Storytelling } from "@/components/storytelling";

export default function Home() {
  return (
    <>
      <main className="relative bg-background">
        <Hero />
        <HowItWorks />
        <Storytelling />
      </main>
      <Leva hidden />
    </>
  );
}
