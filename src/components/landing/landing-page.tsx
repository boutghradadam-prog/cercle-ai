"use client";

import { useAppStore, type Subject } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
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
  Star,
  ArrowRight,
  Check,
  Menu,
  X,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";

/* ─── DIALS per Taste Skill ─── */
const DESIGN_VARIANCE = 7;
const MOTION_INTENSITY = 6;
const VISUAL_DENSITY = 4;

/* ─── Data ─── */

const features = [
  { icon: Calculator, title: "Step-by-step math solver", desc: "From algebra to calculus, get detailed solutions with every step explained.", subject: "math" as Subject },
  { icon: Atom, title: "Science tutor", desc: "Physics, chemistry, and biology with real-world experiments and analogies.", subject: "physics" as Subject },
  { icon: MessageSquare, title: "Conversational AI", desc: "Ask follow-up questions, dig deeper, and learn at your own pace.", subject: "math" as Subject },
  { icon: Camera, title: "Formula recognition", desc: "Snap a photo of any handwritten or printed formula. Cercle AI solves it.", subject: "math" as Subject },
  { icon: FileQuestion, title: "Adaptive quizzes", desc: "AI-generated questions that adjust difficulty based on your performance.", subject: "math" as Subject },
  { icon: Route, title: "Personalized paths", desc: "A learning roadmap built around your gaps, goals, and pace.", subject: "math" as Subject },
];

const subjects = [
  { icon: Calculator, name: "Mathematics", topics: "Algebra, Calculus, Geometry, Statistics", color: "bg-blue-600", subject: "math" as Subject, img: "https://picsum.photos/seed/cercle-math/600/400" },
  { icon: Atom, name: "Physics", topics: "Mechanics, Thermodynamics, Optics", color: "bg-violet-600", subject: "physics" as Subject, img: "https://picsum.photos/seed/cercle-physics/600/400" },
  { icon: FlaskConical, name: "Chemistry", topics: "Organic, Inorganic, Biochemistry", color: "bg-emerald-600", subject: "chemistry" as Subject, img: "https://picsum.photos/seed/cercle-chemistry/600/400" },
  { icon: Leaf, name: "Biology", topics: "Genetics, Ecology, Cell Biology", color: "bg-amber-600", subject: "biology" as Subject, img: "https://picsum.photos/seed/cercle-biology/600/400" },
];

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["5 AI chats per day", "Basic topics", "Progress tracking"], cta: "Start free", popular: false },
  { name: "Pro", price: "$12", period: "/month", features: ["Unlimited chats", "All subjects", "AI quizzes", "Formula recognition", "Learning paths", "Priority support"], cta: "Start Pro trial", popular: true },
  { name: "Premium", price: "$24", period: "/month", features: ["Everything in Pro", "Advanced analytics", "Exam prep mode", "Multi-language", "Teacher tools", "API access"], cta: "Start Premium trial", popular: false },
];

const testimonials = [
  { name: "Sarah Chen", role: "High school student", text: "Went from C to A+ in Calculus. The step-by-step approach actually makes sense.", initials: "SC" },
  { name: "Mohammed Al-Rashid", role: "University student", text: "Arabic support is a game changer. Finally a tutor that speaks my language.", initials: "MR" },
  { name: "Emma Laurent", role: "Teacher", text: "I create personalized quizzes in minutes. Saves me hours every week.", initials: "EL" },
];

const faqs = [
  { q: "How does the AI tutor work?", a: "Type or photograph a problem. Cercle AI breaks it into steps, explains each one, and adapts to your level." },
  { q: "Can I use it for exam prep?", a: "Premium includes exam mode with timed quizzes, past-paper analysis, and focused revision paths." },
  { q: "Is it suitable for all grades?", a: "Elementary arithmetic to university-level quantum physics. The AI adjusts explanations to your level." },
  { q: "What languages are supported?", a: "English, French, and Arabic today. Spanish, Mandarin, and Hindi are coming soon." },
  { q: "Can teachers use it?", a: "Teachers get a dashboard to create assignments, track student progress, and generate class analytics." },
];

/* ─── Animation helpers ─── */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (MOTION_INTENSITY <= 3 || reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Page ─── */

export function LandingPage() {
  const { setView, setSubject } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const goToAuth = () => setView("auth");
  const startSubject = (s: Subject) => { setSubject(s); setView("auth"); };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Cercle AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#subjects" className="hover:text-foreground transition-colors">Subjects</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" onClick={goToAuth}>Sign in</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={goToAuth}>
              Get started
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-3">
            <a href="#features" className="block text-sm text-muted-foreground">Features</a>
            <a href="#pricing" className="block text-sm text-muted-foreground">Pricing</a>
            <a href="#faq" className="block text-sm text-muted-foreground">FAQ</a>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" onClick={goToAuth}>Sign in</Button>
              <Button className="bg-primary text-primary-foreground" onClick={goToAuth}>Get started</Button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero: Split-screen (anti-center bias) ─── */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] mb-6">
                  Learn math and science the way it should be taught
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-[65ch] mb-8">
                  AI-powered tutoring that solves problems step-by-step, generates quizzes, and adapts to how you learn.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-6 h-12" onClick={goToAuth}>
                    Start learning free <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-base px-6 h-12" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                    See how it works
                  </Button>
                </div>
              </div>
            </Reveal>

            {/* Hero visual: real product screenshot */}
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-2xl shadow-primary/5">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-muted/30">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-[11px] text-muted-foreground font-mono">cercle.ai/tutor</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
                        <p className="text-sm">Solve the integral: ∫ x² dx from 0 to 3</p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                        <p className="text-sm leading-relaxed">
                          <strong>Step 1:</strong> Find the antiderivative: x³/3 + C<br />
                          <strong>Step 2:</strong> Evaluate [x³/3]₀³ = 27/3 - 0 = <strong>9</strong>
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Social proof strip ─── */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-green-600" /> Free forever plan</div>
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> 50,000+ students</div>
          <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 average rating</div>
          <div className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-primary" /> 3 languages</div>
        </div>
      </section>

      {/* ─── Features: Bento grid with visual diversity ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to excel
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Six core capabilities designed around how students actually learn, not how textbooks are organized.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <Card
                  className={`group border-border/60 hover:border-primary/40 transition-all cursor-pointer h-full ${
                    i === 0 ? "lg:col-span-2 bg-primary/5 border-primary/20" : ""
                  }`}
                  onClick={() => startSubject(f.subject)}
                >
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-xl ${i === 0 ? "bg-primary" : "bg-muted"} flex items-center justify-center mb-4`}>
                      <f.icon className={`w-5 h-5 ${i === 0 ? "text-primary-foreground" : "text-foreground"}`} />
                    </div>
                    <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Subjects: Full-width image grid ─── */}
      <section id="subjects" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Every subject, every level
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From basic arithmetic to quantum physics, Cercle AI covers it all with depth and clarity.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <button
                  className="group text-left rounded-2xl overflow-hidden border border-border/60 hover:border-primary/40 transition-all"
                  onClick={() => startSubject(s.subject)}
                >
                  <div className="aspect-[3/2] relative overflow-hidden">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className={`absolute inset-0 ${s.color}/20 mix-blend-multiply`} />
                  </div>
                  <div className="p-4 bg-card">
                    <h3 className="font-semibold mb-1">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.topics}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Start free, upgrade when you are ready. Cancel anytime.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Card className={`relative border-border/60 h-full flex flex-col ${plan.popular ? "border-primary shadow-lg shadow-primary/5" : ""}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-bl-xl">
                      Popular
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                    <div className="mb-6 mt-2">
                      <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                      onClick={goToAuth}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials: Asymmetric layout ─── */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Students and teachers agree
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <Card className={`border-border/60 ${i === 1 ? "md:mt-8" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-5">{t.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="py-5">
                  <button
                    className="w-full text-left flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ArrowRight className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-[65ch]">
                      {faq.a}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-2xl bg-primary p-10 sm:p-14 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to learn smarter?
              </h2>
              <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                Join 50,000+ students already using Cercle AI. Free to start, no credit card required.
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 font-semibold"
                onClick={goToAuth}
              >
                Get started free <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight">Cercle AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered education for every student, everywhere.
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
          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Cercle AI. All rights reserved.</p>
            <div className="flex items-center gap-4">
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
