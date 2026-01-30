"use client";

import Link from "next/link";
import Image from "next/image";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-32 h-16 mb-4">
          <Image
            src="/logo.svg"
            alt="Vquiz Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-8xl font-sentient font-bold text-primary tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-semibold font-mono tracking-tight text-foreground">
            Page not found
          </h2>
          <p className="text-foreground/50 text-sm sm:text-base max-w-[350px] mx-auto leading-relaxed">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been removed or doesn&apos;t exist.
          </p>
        </div>

        {/* Action */}
        <div className="pt-4">
          <Link href="/">
            <Button
              variant="app"
              className="rounded-full !px-7 h-11 font-medium"
            >
              <Home className="w-4 h-4 mr-2" />
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
