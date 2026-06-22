"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Brain,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  MessageSquare,
  Camera,
  FileQuestion,
  Route,
  BarChart3,
  Trophy,
  Globe,
  Moon,
  Sun,
  ChevronRight,
  Star,
  Zap,
  Shield,
  GraduationCap,
  Users,
  Check,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

const features = [
  {
    icon: Calculator,
    title: "AI Math Tutor",
    desc: "Step-by-step problem solving with detailed explanations. From algebra to calculus, master every concept.",
    color: "from-blue-500 to-indigo-600",
    subject: "math" as Subject,
  },
  {
    icon: Atom,
    title: "AI Science Tutor",
    desc: "Physics, Chemistry, and Biology explained with real-world examples and interactive diagrams.",
    color: "from-purple-500 to-violet-600",
    subject: "physics" as Subject,
  },
  {
    icon: MessageSquare,
    title: "Interactive Chat",
    desc: "ChatGPT-style conversations with context-aware AI that understands your learning needs.",
    color: "from-cyan-500 to-blue-600",
    subject: "math" as Subject,
  },
  {
    icon: Camera,
    title: "Formula Recognition",
    desc: "Snap a photo of handwritten notes or textbook formulas. Our AI recognizes and solves them instantly.",
    color: "from-pink-500 to-rose-600",
    subject: "math" as Subject,
  },
  {
    icon: FileQuestion,
    title: "AI Quizzes & Exams",
    desc: "Auto-generated quizzes tailored to your level. Track progress with detailed analytics.",
    color: "from-amber-500 to-orange-600",
    subject: "math" as Subject,
  },
  {
    icon: Route,
    title: "Personalized Paths",
    desc: "AI creates custom learning paths based on your strengths, weaknesses, and goals.",
    color: "from-emerald-500 to-teal-600",
    subject: "math" as Subject,
  },
  {
    icon: BarChart3,
    title: "Progress Dashboard",
    desc: "Visual analytics showing your growth, streaks, and areas needing improvement.",
    color: "from-indigo-500 to-purple-600",
    subject: "math" as Subject,
  },
  {
    icon: Trophy,
    title: "Gamification",
    desc: "Earn points, badges, and level up. Compete on leaderboards and stay motivated.",
    color: "from-yellow-500 to-amber-600",
    subject: "math" as Subject,
  },
  {
    icon: Globe,
    title: "Multi-Language",
    desc: "Learn in English, French, or Arabic. More languages coming soon.",
    color: "from-teal-500 to-cyan-600",
    subject: "math" as Subject,
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "High School Student",
    text: "Cercle AI helped me go from a C to an A+ in Calculus. The step-by-step explanations are incredible!",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Mohammed Al-Rashid",
    role: "University Student",
    text: "The Arabic language support is phenomenal. Finally, a math tutor that speaks my language literally!",
    avatar: "MA",
    rating: 5,
  },
  {
    name: "Emma Laurent",
    role: "Teacher",
    text: "I use Cercle AI to create personalized quizzes for my students. It saves me hours every week.",
    avatar: "EL",
    rating: 5,
  },
  {
    name: "James Okafor",
    role: "Parent",
    text: "My daughter's confidence in science has skyrocketed. The gamification keeps her motivated every day.",
    avatar: "JO",
    rating: 5,
  },
];

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
    cta: "Start Free",
    popular: false,
    color: "bg-secondary",
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
    cta: "Start Pro Trial",
    popular: true,
    color: "bg-gradient-to-r from-indigo-500 to-purple-600",
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
    cta: "Start Premium Trial",
    popular: false,
    color: "bg-gradient-to-r from-purple-600 to-pink-600",
  },
];

const faqs = [
  {
    q: "How does Cercle AI's math tutoring work?",
    a: "Our AI analyzes your problem, breaks it into steps, and explains each step clearly. It adapts to your level and provides practice problems to reinforce learning.",
  },
  {
    q: "Can I use Cercle AI for exam preparation?",
    a: "Absolutely! Premium users get access to exam prep mode with timed quizzes, past paper analysis, and focused revision paths tailored to your syllabus.",
  },
  {
    q: "Is Cercle AI suitable for all grade levels?",
    a: "Yes! From elementary school arithmetic to university-level calculus and advanced physics, our AI adapts its explanations to your level.",
  },
  {
    q: "How does the formula recognition feature work?",
    a: "Simply take a photo of a handwritten formula or textbook problem. Our AI vision technology recognizes the mathematical notation and provides a step-by-step solution.",
  },
  {
    q: "Can teachers use Cercle AI?",
    a: "Yes! Teachers get a special dashboard to create assignments, monitor student progress, and generate class-wide analytics. Premium plans include teacher tools.",
  },
  {
    q: "What languages does Cercle AI support?",
    a: "Currently, we support English, French, and Arabic. More languages including Spanish, Mandarin, and Hindi are coming soon.",
  },
];

export function LandingPage() {
  const { setView, setSubject, setUser, setIsAuthenticated } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleGetStarted = () => {
    setView("auth");
  };

  const handleStartChat = (subject: Subject) => {
    setSubject(subject);
    setView("auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Cercle AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" onClick={() => setView("auth")}>
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                onClick={handleGetStarted}
              >
                Get Started Free
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground">Features</a>
            <a href="#pricing" className="block text-sm text-muted-foreground">Pricing</a>
            <a href="#testimonials" className="block text-sm text-muted-foreground">Testimonials</a>
            <a href="#faq" className="block text-sm text-muted-foreground">FAQ</a>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={() => setView("auth")}>Sign In</Button>
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20">
              <Zap className="w-3 h-3 mr-1" />
              AI-Powered Education Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Master Math & Science with{" "}
              <span className="gradient-text">Cercle AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Your personal AI tutor that solves problems step-by-step, generates quizzes,
              recognizes formulas from images, and creates personalized learning paths.
              Learn smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 text-lg px-8 py-6 rounded-xl glow-blue"
                onClick={handleGetStarted}
              >
                Start Learning Free
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-xl"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                See How It Works
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                Free forever plan
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-500" />
                50K+ students
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                4.9/5 rating
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-muted-foreground">Cercle AI - Math Tutor</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                    <p className="text-sm">Solve the integral: ∫ x² dx from 0 to 3</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl rounded-tr-sm px-4 py-3 max-w-lg">
                    <p className="text-sm text-white">
                      Let me solve this step by-step:<br /><br />
                      <strong>Step 1:</strong> Find the antiderivative: ∫ x² dx = x³/3 + C<br /><br />
                      <strong>Step 2:</strong> Evaluate from 0 to 3:<br />
                      = (3³/3) - (0³/3)<br />
                      = 27/3 - 0<br />
                      = 9<br /><br />
                      ✅ The answer is <strong>9</strong>
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by advanced AI, Cercle AI combines the best of Khan Academy, Photomath,
              and ChatGPT into one seamless learning experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer"
                onClick={() => handleStartChat(f.subject)}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Showcase */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Every Subject, <span className="gradient-text">Every Level</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From basic arithmetic to quantum physics, our AI tutors cover it all.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Calculator, name: "Mathematics", topics: "Algebra, Calculus, Geometry, Statistics, Linear Algebra, Number Theory", color: "from-blue-500 to-indigo-600", subject: "math" as Subject },
              { icon: Atom, name: "Physics", topics: "Mechanics, Thermodynamics, Electromagnetism, Optics, Quantum Physics", color: "from-purple-500 to-violet-600", subject: "physics" as Subject },
              { icon: FlaskConical, name: "Chemistry", topics: "Organic, Inorganic, Physical, Biochemistry, Analytical Chemistry", color: "from-emerald-500 to-teal-600", subject: "chemistry" as Subject },
              { icon: Leaf, name: "Biology", topics: "Cell Biology, Genetics, Evolution, Ecology, Anatomy, Microbiology", color: "from-amber-500 to-orange-600", subject: "biology" as Subject },
            ].map((s, i) => (
              <Card key={i} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all cursor-pointer" onClick={() => handleStartChat(s.subject)}>
                <div className={`h-32 bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">{s.topics}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you&apos;re ready. No hidden fees, cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`relative overflow-hidden ${
                  plan.popular
                    ? "border-primary shadow-xl scale-105"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
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
                      plan.popular
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleGetStarted}
                  >
                    {plan.cta}
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">50,000+</span> Students
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-border/50">
                <button
                  className="w-full p-6 text-left flex items-center justify-between"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronRight
                    className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-12 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join 50,000+ students already learning smarter with Cercle AI.
                Start your free account today.
              </p>
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-bold"
                onClick={handleGetStarted}
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold gradient-text">Cercle AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered Math & Science education for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Features</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">About</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Contact</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Cercle AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
