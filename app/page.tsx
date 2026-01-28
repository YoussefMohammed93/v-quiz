"use client";

import { Leva } from "leva";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";

export default function Home() {
  return (
    <>
      <main className="relative bg-background">
        <Hero />
        <HowItWorks />
      </main>
      <Leva hidden />
    </>
  );
}
