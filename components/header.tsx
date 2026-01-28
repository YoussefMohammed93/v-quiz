"use client";

import gsap from "gsap";
import Link from "next/link";

import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { MobileMenu } from "./mobile-menu";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    ScrollTrigger.create({
      start: "top top",
      onUpdate: (self) => {
        // Background/Pill logic - trigger immediately after 1px scroll
        if (self.scroll() > 1) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      },
    });

    // Intro Animation
    const ctx = gsap.context(() => {
      gsap.from(".header-item", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.5,
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        gsap.to(window, {
          scrollTo: {
            y: target,
            offsetY: 80,
          },
          duration: 1.2,
          ease: "power3.inOut",
        });
      }
    }
  };

  return (
    <div
      ref={headerRef}
      className="fixed z-50 top-0 left-0 w-full transition-all duration-500 pt-6"
    >
      <header
        className={cn(
          "flex items-center justify-between container transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-secondary/15 max-w-4xl backdrop-blur-3xl border border-border/50 rounded-full py-3 px-8 shadow-2xl shadow-black/10 scale-[0.98] md:scale-100"
            : "py-2 bg-transparent border-transparent",
        )}
      >
        <Link href="/" className="header-item">
          <Logo className="w-[100px] md:w-[120px]" />
        </Link>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-8">
          {[
            { name: "How it works", href: "#how-it-works" },
            { name: "Product", href: "#product" },
            { name: "Features", href: "#features" },
            { name: "Pricing", href: "#pricing" },
            { name: "FAQ", href: "#faq" },
          ].map((item) => (
            <Link
              className="header-item uppercase inline-block font-mono text-xs text-foreground/60 hover:text-foreground duration-150 transition-colors ease-out"
              href={item.href}
              key={item.name}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="max-lg:hidden header-item">
          <Link href="/#signup">
            <Button size="sm" className="h-10 px-4 font-mono uppercase text-xs">
              Get Started
            </Button>
          </Link>
        </div>
        <div className="lg:hidden flex items-center gap-x-2 header-item">
          <MobileMenu />
        </div>
      </header>
    </div>
  );
};
