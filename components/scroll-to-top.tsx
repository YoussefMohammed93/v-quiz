"use client";

import gsap from "gsap";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        if (!isVisible) setIsVisible(true);
      } else {
        if (isVisible) setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        display: "flex",
      });
    } else {
      gsap.to(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          if (buttonRef.current) {
            // We keep it in the DOM but hidden/moved to avoid potential react reconciler issues with pure display:none if we want to animate back in smoothly
            // But standard GSAP hide is fine.
          }
        },
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="cursor-pointer fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 opacity-0 translate-y-5"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
}
