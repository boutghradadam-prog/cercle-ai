import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Get user with all their data
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        badges: { include: { badge: true } },
        progress: true,
        learningPaths: true,
        quizAttempts: { orderBy: { createdAt: "desc" }, take: 10 },
        chatSessions: { orderBy: { updatedAt: "desc" }, take: 10 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all available badges
    const allBadges = await db.badge.findMany();

    // Calculate subject progress
    const subjectProgress = await calculateSubjectProgress(userId);

    // Calculate stats
    const totalQuizAttempts = await db.quizAttempt.count({ where: { userId } });
    const totalChatSessions = await db.chatSession.count({ where: { userId } });

    // Get recent activity (combined from chat sessions and quiz attempts)
    const recentChats = await db.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const recentQuizzes = await db.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Merge and sort recent activity
    const activity = [
      ...recentChats.map((c) => ({
        type: "chat" as const,
        id: c.id,
        subject: c.subject,
        title: c.title,
        time: c.updatedAt.toISOString(),
        score: null as string | null,
      })),
      ...recentQuizzes.map((q) => ({
        type: "quiz" as const,
        id: q.id,
        subject: q.subject,
        title: `${q.subject.charAt(0).toUpperCase() + q.subject.slice(1)} Quiz`,
        time: q.createdAt.toISOString(),
        score: `${Math.round((q.score / q.total) * 100)}%`,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        points: user.points,
        level: user.level,
        streak: user.streak,
        language: user.language,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
      badges: allBadges.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        category: b.category,
        earned: user.badges.some((ub) => ub.badgeId === b.id),
        earnedAt: user.badges.find((ub) => ub.badgeId === b.id)?.earnedAt || null,
      })),
      progress: subjectProgress,
      learningPaths: user.learningPaths,
      recentActivity: activity,
      stats: {
        totalQuizAttempts,
        totalChatSessions,
      },
    });
  } catch (error) {
    console.error("Data API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function calculateSubjectProgress(userId: string) {
  const subjects = ["math", "physics", "chemistry", "biology"];

  const result = [];
  for (const subject of subjects) {
    const progressEntries = await db.progress.findMany({
      where: { userId, subject },
    });

    const quizAttempts = await db.quizAttempt.findMany({
      where: { userId, subject },
    });

    const chatSessions = await db.chatSession.findMany({
      where: { userId, subject },
    });

    let mastery = 0;
    let completed = 0;
    let total = 0;

    if (progressEntries.length > 0) {
      mastery = Math.round(
        progressEntries.reduce((sum, p) => sum + p.mastery, 0) / progressEntries.length
      );
      completed = progressEntries.reduce((sum, p) => sum + p.completed, 0);
      total = progressEntries.reduce((sum, p) => sum + p.total, 0);
    } else {
      // Calculate based on quiz scores
      if (quizAttempts.length > 0) {
        const avgScore =
          quizAttempts.reduce((sum, q) => sum + q.score / q.total, 0) /
          quizAttempts.length;
        mastery = Math.round(avgScore * 100);
      }
      total = quizAttempts.length * 5 + chatSessions.length;
      completed = quizAttempts.filter((q) => q.score / q.total >= 0.7).length * 5 + chatSessions.length;
    }

    result.push({
      subject,
      mastery,
      completed,
      total,
      quizCount: quizAttempts.length,
      chatCount: chatSessions.length,
    });
  }

  return result;
}
