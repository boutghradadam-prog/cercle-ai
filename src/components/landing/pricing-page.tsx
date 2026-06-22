"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with basic AI tutoring",
    features: [
      "5 AI conversations per day",
      "Basic math & science topics",
      "Progress tracking",
      "Community access",
    ],
    cta: "Current Plan",
    popular: false,
    current: true,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For serious learners who want more",
    features: [
      "Unlimited AI conversations",
      "All subjects & topics",
      "AI-generated quizzes",
      "Formula recognition",
      "Personalized learning paths",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
    current: false,
  },
  {
    name: "Premium",
    price: "$24",
    period: "/month",
    desc: "The ultimate learning experience",
    features: [
      "Everything in Pro",
      "Advanced analytics",
      "Exam preparation mode",
      "Multi-language support",
      "Teacher dashboard",
      "Custom curriculum",
      "API access",
      "Dedicated support",
    ],
    cta: "Upgrade to Premium",
    popular: false,
    current: false,
  },
];

export function PricingPage() {
  const { setView } = useAppStore();

  const handleUpgrade = (plan: string) => {
    // In production, this would redirect to Stripe checkout
    alert(`Upgrading to ${plan}! In production, this would redirect to Stripe checkout.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold">Upgrade Your Plan</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
            <Crown className="w-3 h-3 mr-1" /> Pricing
          </Badge>
          <h2 className="text-3xl font-bold mb-3">
            Unlock Your Full <span className="gradient-text">Potential</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upgrade to access unlimited AI tutoring, quizzes, and advanced features.
            Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative overflow-hidden ${
                plan.popular
                  ? "border-primary shadow-xl scale-[1.02]"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <Button
                  className={`w-full mb-6 ${
                    plan.current
                      ? ""
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700"
                  }`}
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {plan.current ? "Current Plan" : plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day free trial. No credit card required to start.
          </p>
        </div>
      </div>
    </div>
  );
}
