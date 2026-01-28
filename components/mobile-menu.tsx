"use client";

import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";

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
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  const menuItems = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Product", href: "#product" },
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
            "p-2 text-foreground transition-colors lg:hidden",
            className,
          )}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          onInteractOutside={() => {
            // Prevent closing when clicking outside if needed,
            // but Radix usually handles this well.
          }}
          className="fixed top-0 left-0 z-50 h-screen w-full bg-background/95 backdrop-blur-md transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
        >
          <div className="container mx-auto flex h-full flex-col">
            <div className="flex items-center justify-between py-6 pt-12">
              <Dialog.Title className="sr-only">Menu</Dialog.Title>
              <div className="flex items-center gap-3">
                <Image src="./logo.svg" alt="Logo" width={50} height={50} />
                <h2 className="text-4xl font-mono">Vquiz</h2>
              </div>
              <Dialog.Close asChild>
                <button
                  className="cursor-pointer p-2 text-foreground hover:text-primary transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </Dialog.Close>
            </div>

            <nav className="flex flex-col space-y-8 mt-12">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className="text-2xl font-mono uppercase text-foreground/60 transition-colors ease-out duration-150 hover:text-foreground py-2 border-b border-border/50"
                >
                  {item.name}
                </Link>
              ))}

              <div className="mt-8">
                <Link
                  href="/#signup"
                  onClick={(e) => handleLinkClick(e, "#signup")}
                  className="inline-block text-2xl font-mono uppercase text-primary transition-colors ease-out duration-150 hover:text-primary/80 py-2"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
