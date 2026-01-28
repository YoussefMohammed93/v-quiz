"use client";

import { Leva } from "leva";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <main className="relative bg-background">
        <Hero />
      </main>
      <Leva hidden />
    </>
  );
}
