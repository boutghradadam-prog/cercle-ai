"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  MessageSquare,
  FileQuestion,
  Trophy,
  Settings,
  LogOut,
  Flame,
  Star,
  ChevronRight,
  BookOpen,
  Zap,
  Crown,
  Moon,
  Sun,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const quickActions = [
  { icon: Calculator, label: "Math Tutor", subject: "math" as const, color: "from-blue-500 to-indigo-600", desc: "Algebra, Calculus, Geometry..." },
  { icon: Atom, label: "Physics Tutor", subject: "physics" as const, color: "from-purple-500 to-violet-600", desc: "Mechanics, Thermodynamics..." },
  { icon: FlaskConical, label: "Chemistry Tutor", subject: "chemistry" as const, color: "from-emerald-500 to-teal-600", desc: "Organic, Inorganic..." },
  { icon: Leaf, label: "Biology Tutor", subject: "biology" as const, color: "from-amber-500 to-orange-600", desc: "Genetics, Ecology..." },
];

const subjectColors: Record<string, string> = {
  math: "bg-blue-500",
  physics: "bg-purple-500",
  chemistry: "bg-emerald-500",
  biology: "bg-amber-500",
};

const subjectLabels: Record<string, string> = {
  math: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function DashboardPage() {
  const {
    user, setView, setSubject, setUser, setIsAuthenticated,
    badges, subjectProgress, recentActivity, fetchUserData,
  } = useAppStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (user?.id && user.id !== "admin") {
      fetchUserData(user.id);
    }
  }, [user?.id, fetchUserData]);

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setView("landing");
  };

  const subjectProgressData = subjectProgress.length > 0
    ? subjectProgress
    : [
        { subject: "math", mastery: 0, completed: 0, total: 0, quizCount: 0, chatCount: 0 },
        { subject: "physics", mastery: 0, completed: 0, total: 0, quizCount: 0, chatCount: 0 },
        { subject: "chemistry", mastery: 0, completed: 0, total: 0, quizCount: 0, chatCount: 0 },
        { subject: "biology", mastery: 0, completed: 0, total: 0, quizCount: 0, chatCount: 0 },
      ];

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Cercle AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { if (user?.id && user.id !== "admin") fetchUserData(user.id); }} title="Refresh data">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setView("settings")}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 pl-2 border-l">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground">
            {user?.streak && user.streak > 0
              ? `You're on a ${user.streak}-day streak! Keep it going!`
              : "Start learning today to build your streak!"}
          </p>
        </div>

        {/* Stats Row - Real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Points", value: user?.points ?? 0, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { label: "Level", value: user?.level ?? 1, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Streak", value: `${user?.streak ?? 0} days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
            { label: "Plan", value: (user?.plan ?? "free").charAt(0).toUpperCase() + (user?.plan ?? "free").slice(1), icon: Crown, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Start Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Card
                key={i}
                className="group cursor-pointer border-border/50 hover:border-primary/30 transition-all hover:shadow-md"
                onClick={() => {
                  setSubject(action.subject);
                  setView("chat");
                }}
              >
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Section - Real data */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Subject Progress</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setView("progress")}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjectProgressData.map((sub) => (
                  <div key={sub.subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{subjectLabels[sub.subject] || sub.subject}</span>
                      <span className="text-muted-foreground">
                        {sub.mastery}%{sub.quizCount > 0 && ` (${sub.quizCount} quizzes)`}
                      </span>
                    </div>
                    <Progress value={sub.mastery} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity - Real data */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No activity yet. Start a chat or quiz!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((act) => (
                      <div key={act.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          act.type === "chat" ? "bg-blue-500/10" : "bg-green-500/10"
                        }`}>
                          {act.type === "chat" ? (
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FileQuestion className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{act.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {subjectLabels[act.subject] || act.subject} · {timeAgo(act.time)}
                          </p>
                        </div>
                        {act.score && (
                          <Badge variant="secondary" className="text-xs">{act.score}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Quiz */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileQuestion className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Quick Quiz</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Test your knowledge with an AI-generated quiz
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0"
                  onClick={() => setView("quiz")}
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Badges - Real data */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Badges
                  {earnedBadges.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{earnedBadges.length}/{badges.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {badges.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Start learning to earn badges!
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {badges.slice(0, 9).map((b) => (
                      <div
                        key={b.id}
                        className={`text-center p-2 rounded-lg ${
                          b.earned ? "bg-yellow-500/10" : "bg-muted/50 opacity-40"
                        }`}
                        title={b.earned ? `${b.name}: ${b.description}` : `${b.name}: ${b.description} (locked)`}
                      >
                        <div className="text-2xl mb-1">{b.icon}</div>
                        <p className="text-[10px] font-medium leading-tight">{b.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Path - from real progress */}
            <Card className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Your Topics</h3>
                </div>
                <div className="space-y-3">
                  {subjectProgressData.flatMap((sub) =>
                    sub.quizCount > 0 || sub.chatCount > 0
                      ? [{ step: `${subjectLabels[sub.subject]} (${sub.mastery}% mastered)`, done: sub.mastery >= 70 }]
                      : []
                  ).length > 0 ? (
                    subjectProgressData.flatMap((sub) =>
                      (sub.quizCount > 0 || sub.chatCount > 0)
                        ? [{ step: `${subjectLabels[sub.subject]} (${sub.mastery}% mastered)`, done: sub.mastery >= 70 }]
                        : []
                    ).map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          s.done ? "bg-green-500 text-white" : "border-2 border-muted-foreground/30"
                        }`}>
                          {s.done && "✓"}
                        </div>
                        <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : ""}`}>{s.step}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      <p>Start learning to track your topics!</p>
                      <Button variant="link" className="text-primary text-xs mt-1" onClick={() => { setSubject("math"); setView("chat"); }}>
                        Start with Math
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
