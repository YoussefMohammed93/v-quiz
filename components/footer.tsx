"use client";

import gsap from "gsap";
import Link from "next/link";

import { Logo } from "./logo";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Main columns reveal
      gsap.fromTo(
        ".footer-column",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".footer-grid",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Social icons reveal
      gsap.fromTo(
        ".footer-social",
        { scale: 0.8, opacity: 0, y: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".social-container",
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Bottom bar reveal
      gsap.fromTo(
        ".footer-bottom",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 98%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="py-24 border-t border-border/80 bg-background overflow-hidden"
    >
      <div className="container">
        <div className="footer-grid grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="footer-column col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Logo className="w-32" />
            </Link>
            <p className="font-mono text-xs text-foreground/45 leading-relaxed max-w-xs">
              Chat-native AI quizzes to help you learn faster. Turn any topic
              into interactive MCQs instantly.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-foreground/45 mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#features"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-foreground/45 mb-6">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-mono text-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="size-1 bg-primary/20 rounded-full group-hover:bg-primary transition-colors" />
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-foreground/45 mb-6">
              Social
            </h4>
            <div className="social-container flex gap-4">
              <Link
                href="#"
                className="footer-social size-10 bg-secondary/20 border-2 border-border rounded-full flex items-center justify-center hover:border-primary/70 transition-colors"
              >
                <Twitter className="size-4 text-foreground/60" />
              </Link>
              <Link
                href="#"
                className="footer-social size-10 bg-secondary/20 border-2 border-border rounded-full flex items-center justify-center hover:border-primary/70 transition-colors"
              >
                <Github className="size-4 text-foreground/60" />
              </Link>
              <Link
                href="#"
                className="footer-social size-10 bg-secondary/20 border-2 border-border rounded-full flex items-center justify-center hover:border-primary/70 transition-colors"
              >
                <Linkedin className="size-4 text-foreground/60" />
              </Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom pt-8 border-t border-border/60 gap-6">
          <div className="font-mono text-[10px] text-foreground/45 uppercase tracking-widest">
            © Vquiz 2026. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
