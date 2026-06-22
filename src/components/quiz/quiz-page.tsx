"use client";

import { useAppStore, type Subject, type QuizQuestion } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const subjects: { key: Subject; label: string; icon: typeof Calculator; color: string }[] = [
  { key: "math", label: "Math", icon: Calculator, color: "from-blue-500 to-indigo-600" },
  { key: "physics", label: "Physics", icon: Atom, color: "from-purple-500 to-violet-600" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "from-emerald-500 to-teal-600" },
  { key: "biology", label: "Biology", icon: Leaf, color: "from-amber-500 to-orange-600" },
];

const difficulties = [
  { key: "easy", label: "Easy", desc: "Basic concepts" },
  { key: "medium", label: "Medium", desc: "Intermediate level" },
  { key: "hard", label: "Hard", desc: "Advanced problems" },
];

export function QuizPage() {
  const { user, setUser, setView, quizQuestions, setQuizQuestions, currentQuizIndex, setCurrentQuizIndex, quizScore, setQuizScore } = useAppStore();
  const [selectedSubject, setSelectedSubject] = useState<Subject>("math");
  const [difficulty, setDifficulty] = useState("medium");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const saveQuizAttempt = async (score: number, total: number, answerList: (number | null)[]) => {
    if (!user?.id || user.id === "admin") return;

    try {
      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-quiz",
          userId: user.id,
          subject: selectedSubject,
          score,
          total,
          answers: answerList,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update user points in store
        if (data.pointsEarned && user) {
          setUser({
            ...user,
            points: user.points + data.pointsEarned,
            level: Math.floor((user.points + data.pointsEarned) / 100) + 1,
          });
          toast.success(`+${data.pointsEarned} points earned!`);
        }
      }
    } catch (e) {
      console.error("Failed to save quiz attempt:", e);
    }
  };

  const generateQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: topic || `general ${selectedSubject}`,
          count: 5,
          difficulty,
        }),
      });
      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
        setCurrentQuizIndex(0);
        setQuizScore(0);
        setAnswers([]);
        setQuizStarted(true);
        setQuizFinished(false);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch {
      toast.error("Error generating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);

    const currentQ = quizQuestions[currentQuizIndex];
    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Quiz finished - save to database
      const finalScore = quizScore;
      setQuizFinished(true);
      saveQuizAttempt(finalScore, quizQuestions.length, answers);
    }
  };

  const handleRetry = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setAnswered(false);
    setQuizQuestions([]);
  };

  const currentSubject = subjects.find((s) => s.key === selectedSubject) || subjects[0];

  // Quiz setup screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 flex items-center gap-3 h-14">
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">AI Quiz Generator</h1>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Your Quiz</h2>
            <p className="text-muted-foreground text-sm">
              Choose a subject, difficulty, and optional topic. Our AI will generate personalized questions.
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Subject</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {subjects.map((s) => (
                    <button
                      key={s.key}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedSubject === s.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedSubject(s.key)}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                        <s.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((d) => (
                    <button
                      key={d.key}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        difficulty === d.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => setDifficulty(d.key)}
                    >
                      <span className="text-sm font-medium block">{d.label}</span>
                      <span className="text-[10px] text-muted-foreground">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Topic (optional)</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={`e.g., "Quadratic equations" or "Newton's Laws"`}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 py-6 text-base"
                onClick={generateQuiz}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating Quiz...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Generate Quiz
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz finished screen
  if (quizFinished) {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-4 flex items-center gap-3 h-14">
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">Quiz Results</h1>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-4 py-12">
          <Card className="border-border/50 text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                You scored {quizScore} out of {quizQuestions.length}
              </p>
              <div className="text-5xl font-bold gradient-text mb-6">{percentage}%</div>
              <Progress value={percentage} className="h-3 mb-8" />
              {user?.id && user.id !== "admin" && (
                <p className="text-sm text-primary mb-4">
                  Results saved! Points have been added to your profile.
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleRetry}>
                  <RotateCcw className="w-4 h-4 mr-1" /> Try Again
                </Button>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0" onClick={() => setView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active quiz screen
  const currentQ = quizQuestions[currentQuizIndex];
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setQuizStarted(false); setQuizQuestions([]); }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-semibold">Quiz</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {currentQuizIndex + 1}/{quizQuestions.length}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Progress value={((currentQuizIndex + 1) / quizQuestions.length) * 100} className="h-2 mb-6" />

        <Card className="border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Question {currentQuizIndex + 1}</Badge>
            </div>
            <h2 className="text-lg font-semibold mb-6">{currentQ.question}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option, i) => {
                let optionClass = "border-border hover:border-primary/30";
                if (answered) {
                  if (i === currentQ.correctIndex) {
                    optionClass = "border-green-500 bg-green-500/10";
                  } else if (i === selectedAnswer && i !== currentQ.correctIndex) {
                    optionClass = "border-red-500 bg-red-500/10";
                  }
                } else if (selectedAnswer === i) {
                  optionClass = "border-primary bg-primary/5";
                }

                return (
                  <button
                    key={i}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${optionClass}`}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-medium ${
                      answered && i === currentQ.correctIndex
                        ? "bg-green-500 text-white"
                        : answered && i === selectedAnswer && i !== currentQ.correctIndex
                        ? "bg-red-500 text-white"
                        : "bg-muted"
                    }`}>
                      {answered && i === currentQ.correctIndex ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : answered && i === selectedAnswer && i !== currentQ.correctIndex ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </div>
                    <span className="text-sm">{option}</span>
                  </button>
                );
              })}
            </div>

            {answered && currentQ.explanation && (
              <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm">
                  <strong>Explanation:</strong> {currentQ.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {answered && (
          <div className="flex justify-end">
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
              onClick={handleNext}
            >
              {currentQuizIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
