"use client";

import { Leva } from "leva";
import { FAQ } from "@/components/faq";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Pricing } from "@/components/pricing";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Storytelling } from "@/components/storytelling";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {

  return (
    <SmoothScroll>
      <main className="relative bg-background">
        <Header />
        <Hero />
        <HowItWorks />
        <Storytelling />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
      <ScrollToTop />
      <Leva hidden />
    </SmoothScroll>
  );
}
