"use client";

import gsap from "gsap";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu = ({ className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const menuItems = [
    { name: "Product", href: "#product" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    setIsOpen(false);

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
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "group lg:hidden p-2 text-foreground transition-colors",
            className,
          )}
          aria-label="Open menu"
        >
          <Menu className="group-data-[state=open]:hidden" size={24} />
          <X className="hidden group-data-[state=open]:block" size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <div
          data-overlay="true"
          className="fixed z-30 inset-0 bg-black/50 backdrop-blur-sm"
        />

        <Dialog.Content
          onInteractOutside={(e) => {
            if (
              e.target instanceof HTMLElement &&
              e.target.dataset.overlay !== "true"
            ) {
              e.preventDefault();
            }
          }}
          className="fixed top-0 left-0 w-full z-40 py-28 md:py-40"
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <nav className="flex flex-col space-y-6 container mx-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="text-xl font-mono uppercase text-foreground/60 transition-colors ease-out duration-150 hover:text-foreground py-2"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-6">
              <Link
                href="/#signup"
                onClick={(e) => handleLinkClick(e, "#signup")}
                className="inline-block text-xl font-mono uppercase text-primary transition-colors ease-out duration-150 hover:text-primary/80 py-2"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
