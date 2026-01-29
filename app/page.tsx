"use client";

import { Leva } from "leva";
import { FAQ } from "@/components/faq";
import { useQuery } from "convex/react";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { api } from "@/convex/_generated/api";
import { Pricing } from "@/components/pricing";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Storytelling } from "@/components/storytelling";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  const tasks = useQuery(api.tasks.get);

  return (
    <SmoothScroll>
      <main className="relative bg-background">
        <Header />
        <div className="w-80 h-80">
          {tasks?.map((task) => (
            <div key={task._id}>{task.text}</div>
          ))}
        </div>
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
