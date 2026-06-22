import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get all real users from database
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        badges: { include: { badge: true } },
        quizAttempts: true,
        chatSessions: true,
      },
    });

    // Calculate real subscription stats
    const planStats = await db.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });

    const totalUsers = users.length;
    const activeUsers = users.filter(
      (u) => Date.now() - u.lastActiveAt.getTime() < 7 * 24 * 60 * 60 * 1000
    ).length;

    const subscriptionStats = {
      free: { count: 0, revenue: 0 },
      pro: { count: 0, revenue: 0 },
      premium: { count: 0, revenue: 0 },
    };

    for (const stat of planStats) {
      const plan = stat.plan as keyof typeof subscriptionStats;
      if (subscriptionStats[plan]) {
        subscriptionStats[plan].count = stat._count.plan;
      }
    }

    // Calculate monthly revenue (Pro: $12, Premium: $24)
    subscriptionStats.pro.revenue = subscriptionStats.pro.count * 12;
    subscriptionStats.premium.revenue = subscriptionStats.premium.count * 24;
    const totalRevenue = subscriptionStats.pro.revenue + subscriptionStats.premium.revenue;

    // Total quiz attempts across all users
    const totalQuizAttempts = await db.quizAttempt.count();
    const totalChatSessions = await db.chatSession.count();

    // Average quiz score
    const allQuizzes = await db.quizAttempt.findMany();
    const avgScore =
      allQuizzes.length > 0
        ? Math.round(
            (allQuizzes.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) /
              allQuizzes.length) 
          )
        : 0;

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name || "Anonymous",
        email: u.email,
        role: u.role,
        plan: u.plan,
        points: u.points,
        level: u.level,
        streak: u.streak,
        language: u.language,
        active: Date.now() - u.lastActiveAt.getTime() < 7 * 24 * 60 * 60 * 1000,
        createdAt: u.createdAt,
        lastActiveAt: u.lastActiveAt,
        badgeCount: u.badges.length,
        quizCount: u.quizAttempts.length,
        chatCount: u.chatSessions.length,
      })),
      stats: {
        totalUsers,
        activeUsers,
        totalRevenue,
        totalQuizAttempts,
        totalChatSessions,
        avgScore,
      },
      subscriptionStats,
    });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Update user (role, plan, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const { userId, role, plan, points, level } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (role) data.role = role;
    if (plan) data.plan = plan;
    if (points !== undefined) data.points = points;
    if (level !== undefined) data.level = level;

    const user = await db.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      points: user.points,
      level: user.level,
    });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Delete user
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    await db.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Users DELETE error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
