"use client";

import Link from "next/link";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense } from "react";
import { PricingBackground } from "@/components/pricing-bg";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ChevronLeft, CreditCard } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Plan data
const PLANS = {
  free: {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "5 AI messages per day",
      "MCQ quizzes inside chat",
      "1 image per message",
    ],
  },
  basic: {
    name: "Basic",
    price: 1.99,
    description: "For serious learners",
    features: [
      "50 AI messages per day",
      "Image analysis for questions",
      "Priority quiz generation",
    ],
  },
  pro: {
    name: "Pro",
    price: 4.99,
    description: "Ultimate power for pros",
    features: [
      "Unlimited AI messages",
      "Advanced quiz history & stats",
      "Faster responses",
      "Priority support",
    ],
  },
};

type PlanKey = keyof typeof PLANS;

function PaymentPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden">
      {/* Background Effects Skeleton */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Header Skeleton */}
      <header className="relative z-10 px-4 py-6 md:py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <Skeleton className="h-10 w-24 rounded-full bg-muted/20" />
        <Skeleton className="h-10 w-32 bg-muted/20" />
      </header>

      <main className="relative z-10 flex-1 container max-w-5xl mx-auto px-4 pb-20 flex flex-col md:flex-row gap-8 lg:gap-12 items-start justify-center pt-8">
        {/* Left: Plan Summary Skeleton */}
        <div className="w-full md:w-5/12">
          <div className="bg-muted/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <Skeleton className="h-6 w-24 mb-4 bg-muted/20 rounded-full" />
            <Skeleton className="h-10 w-48 mb-2 bg-muted/20" />
            <Skeleton className="h-6 w-full mb-6 bg-muted/20" />

            <div className="flex items-baseline gap-1 mb-8">
              <Skeleton className="h-16 w-32 bg-muted/20" />
            </div>

            <div className="space-y-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="h-6 w-6 rounded-full bg-muted/20" />
                  <Skeleton className="h-4 w-full bg-muted/20" />
                </div>
              ))}
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 space-y-3">
              <Skeleton className="h-8 w-full bg-muted/20" />
            </div>
          </div>
        </div>

        {/* Right: Payment Form Skeleton */}
        <div className="w-full md:w-7/12">
          <div className="bg-muted/15 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <Skeleton className="h-8 w-48 mb-6 bg-muted/20" />

            <div className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32 bg-muted/20" />
                <Skeleton className="h-12 w-full bg-muted/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-muted/20" />
                  <Skeleton className="h-12 w-full bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24 bg-muted/20" />
                  <Skeleton className="h-12 w-full bg-muted/20" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-40 bg-muted/20" />
                <Skeleton className="h-12 w-full bg-muted/20" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-24 bg-muted/20" />
                <Skeleton className="h-12 w-full bg-muted/20" />
              </div>

              <Skeleton className="h-14 w-full rounded-lg bg-muted/20 mt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PaymentPageContent() {
  const { isLoaded, userId } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  // Handle plan selection safely
  const planParam = searchParams.get("plan");
  const selectedPlan: PlanKey =
    planParam && Object.keys(PLANS).includes(planParam)
      ? (planParam as PlanKey)
      : "pro";

  useEffect(() => {
    if ((isLoaded && !userId) || planParam === "free") {
      router.push("/?redirect=/app/payment");
    }
  }, [isLoaded, userId, router, planParam]);

  // Show skeleton while loading auth or redirecting
  if (!isLoaded || (isLoaded && !userId) || planParam === "free") {
    return <PaymentPageSkeleton />;
  }

  const plan = PLANS[selectedPlan];
  const total = plan.price;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <PricingBackground />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 md:py-8 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div>
          <Link href="/app">
            <Button variant="outlineApp" className="rounded-full h-10 !px-5">
              <ChevronLeft className="size-5" />
              <span>Back</span>
            </Button>
          </Link>
        </div>

        {/* Logo */}
        <div className="h-10 w-auto relative">
          <Link href="/app">
            <Image
              src="/logo.svg"
              alt="Vquiz Logo"
              width={100}
              height={40}
              className="h-full w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 container max-w-5xl mx-auto px-4 pb-20 flex flex-col md:flex-row gap-8 lg:gap-12 items-start justify-center pt-8">
        {/* Plan Summary Card - First on Mobile, Left on Desktop */}
        <div className="w-full md:w-5/12">
          <div className="bg-muted/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-8 relative md:sticky md:top-24 overflow-hidden group">
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-700" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                  Selected Plan
                </span>
              </div>
              <h2 className="text-4xl font-sentient mb-2">{plan.name}</h2>
              <p className="text-muted-foreground text-base mb-6">
                {plan.description}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold tracking-tight">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="mt-1 bg-primary/20 p-1.5 rounded-full">
                      <Check className="size-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-tight font-mono mt-1">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 space-y-3">
                <div className="flex justify-between text-sm border-white/10 font-bold text-lg">
                  <span className="font-mono">Total due</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form - Second on Mobile, Right on Desktop */}
        <div className="w-full md:w-7/12">
          <div className="bg-muted/15 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Details
              </h3>
              <div className="hidden sm:flex gap-2">
                <div className="bg-white rounded h-6 w-10 flex items-center justify-center p-0.5">
                  <Image
                    src="/visa.png"
                    alt="Visa"
                    width={32}
                    height={20}
                    className="object-contain max-h-full"
                  />
                </div>
                <div className="bg-white rounded h-6 w-10 flex items-center justify-center p-0.5">
                  <Image
                    src="/mastercard.png"
                    alt="Mastercard"
                    width={32}
                    height={20}
                    className="object-contain max-h-full"
                  />
                </div>
                <div className="bg-white rounded h-6 w-10 flex items-center justify-center p-0.5">
                  <Image
                    src="/paypal.png"
                    alt="PayPal"
                    width={32}
                    height={20}
                    className="object-contain max-h-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Card Number */}
              <div className="space-y-4">
                <Label>Card number</Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  className="bg-secondary/50 border-white/10 h-12 focus:border-primary/50 transition-all font-mono"
                />
              </div>

              {/* Expiry & Security Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiration Date</Label>
                  <Input
                    placeholder="MM / YY"
                    className="bg-secondary/50 border-white/10 h-12 focus:border-primary/50 transition-all font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Security Code</Label>
                  <Input
                    placeholder="CVC"
                    className="bg-secondary/50 border-white/10 h-12 focus:border-primary/50 transition-all font-mono"
                    type="password"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-4">
                <Label>Full Name of Card Holder</Label>
                <Input
                  placeholder="John Doe"
                  className="bg-secondary/50 border-white/10 h-12 focus:border-primary/50 transition-all"
                />
              </div>

              {/* Country */}
              <div className="space-y-4">
                <Label>Country</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50 border-white/10 h-12 focus:border-primary/50 w-full text-foreground/80">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border/40 mt-0.5">
                    <SelectItem value="eg" className="text-foreground/80">
                      Egypt
                    </SelectItem>
                    <SelectItem value="sa" className="text-foreground/80">
                      Saudi Arabia
                    </SelectItem>
                    <SelectItem value="ae" className="text-foreground/80">
                      United Arab Emirates
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Terms Agreement Checkbox */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-white/5 cursor-pointer hover:bg-secondary/40 transition-colors"
                onClick={() => setAgreed(!agreed)}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5",
                    agreed
                      ? "bg-primary border-primary"
                      : "border-white/20 bg-transparent",
                  )}
                >
                  {agreed && (
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed select-none">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline">
                    Privacy Policy
                  </span>
                  . I understand that my subscription will renew automatically
                  every month until I cancel.
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full h-14 text-base sm:text-lg font-semibold shadow-glow shadow-primary/20 relative group overflow-hidden"
                  disabled={!agreed}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {agreed
                      ? "Confirm Subscription"
                      : "Agree to Terms to Continue"}
                  </span>
                  <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Badges - Bottom */}
          <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-1">
              <Image
                src="/visa.png"
                alt="Visa"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/mastercard.png"
                alt="Mastercard"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/paypal.png"
                alt="PayPal"
                width={40}
                height={25}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent />
    </Suspense>
  );
}
