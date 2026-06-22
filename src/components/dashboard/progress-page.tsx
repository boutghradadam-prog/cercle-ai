"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  TrendingUp,
  BookOpen,
  Target,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklyData = [
  { day: "Mon", math: 45, physics: 30, chemistry: 20, biology: 15 },
  { day: "Tue", math: 60, physics: 40, chemistry: 35, biology: 25 },
  { day: "Wed", math: 30, physics: 55, chemistry: 25, biology: 40 },
  { day: "Thu", math: 75, physics: 35, chemistry: 50, biology: 30 },
  { day: "Fri", math: 50, physics: 45, chemistry: 40, biology: 55 },
  { day: "Sat", math: 80, physics: 60, chemistry: 45, biology: 35 },
  { day: "Sun", math: 65, physics: 50, chemistry: 55, biology: 45 },
];

const progressData = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 58 },
  { month: "Apr", score: 65 },
  { month: "May", score: 72 },
  { month: "Jun", score: 78 },
];

const subjectDistribution = [
  { name: "Math", value: 40, color: "#3B82F6" },
  { name: "Physics", value: 25, color: "#8B5CF6" },
  { name: "Chemistry", value: 20, color: "#10B981" },
  { name: "Biology", value: 15, color: "#F59E0B" },
];

const topics = [
  { subject: "Math", name: "Algebra", mastery: 85, icon: Calculator, color: "text-blue-500" },
  { subject: "Math", name: "Calculus", mastery: 62, icon: Calculator, color: "text-blue-500" },
  { subject: "Math", name: "Geometry", mastery: 74, icon: Calculator, color: "text-blue-500" },
  { subject: "Physics", name: "Mechanics", mastery: 55, icon: Atom, color: "text-purple-500" },
  { subject: "Physics", name: "Thermodynamics", mastery: 42, icon: Atom, color: "text-purple-500" },
  { subject: "Chemistry", name: "Organic", mastery: 68, icon: FlaskConical, color: "text-emerald-500" },
  { subject: "Chemistry", name: "Inorganic", mastery: 50, icon: FlaskConical, color: "text-emerald-500" },
  { subject: "Biology", name: "Genetics", mastery: 38, icon: Leaf, color: "text-amber-500" },
];

export function ProgressPage() {
  const { user, setView } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold">Progress & Analytics</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Study Hours", value: "128", change: "+12%", icon: BookOpen, color: "text-blue-500" },
            { label: "Quizzes Completed", value: "45", change: "+8%", icon: Target, color: "text-green-500" },
            { label: "Average Score", value: "78%", change: "+5%", icon: TrendingUp, color: "text-purple-500" },
            { label: "Badges Earned", value: "6", change: "+2", icon: Award, color: "text-yellow-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-green-500 mb-1">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Activity (minutes)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="math" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="physics" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="chemistry" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="biology" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Progress Over Time */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Score Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      strokeWidth={3}
                      dot={{ fill: "#6366F1", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic Mastery */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Topic Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3">
                  <topic.icon className={`w-4 h-4 ${topic.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate">{topic.name}</span>
                      <span className="text-muted-foreground shrink-0">{topic.mastery}%</span>
                    </div>
                    <Progress value={topic.mastery} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Study Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {subjectDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {subjectDistribution.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-muted-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
