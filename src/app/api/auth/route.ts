import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name, adminPassword } = await req.json();

    if (action === "signup") {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 409 }
        );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: { email, name, passwordHash, role: "student", plan: "free" },
      });

      // Seed initial badges
      const badges = await db.badge.findMany();
      if (badges.length === 0) {
        await db.badge.createMany({
          data: [
            { name: "First Steps", description: "Complete your first lesson", icon: "🎯", category: "progress" },
            { name: "Math Explorer", description: "Solve 10 math problems", icon: "🧮", category: "math" },
            { name: "Science Whiz", description: "Score 100% on a science quiz", icon: "🔬", category: "science" },
            { name: "Streak Master", description: "Maintain a 7-day streak", icon: "🔥", category: "streak" },
            { name: "Quick Learner", description: "Complete 5 topics in one day", icon: "⚡", category: "progress" },
            { name: "Quiz Champion", description: "Score 90%+ on 5 quizzes", icon: "🏆", category: "quiz" },
            { name: "Night Owl", description: "Study after midnight", icon: "🦉", category: "fun" },
            { name: "Perfectionist", description: "Get 100% on any quiz", icon: "💎", category: "quiz" },
          ],
        });
      }

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        points: user.points,
        level: user.level,
        streak: user.streak,
      });
    }

    if (action === "signin") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password required" },
          { status: 400 }
        );
      }

      const user = await db.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        points: user.points,
        level: user.level,
        streak: user.streak,
        language: user.language,
      });
    }

    if (action === "admin-signin") {
      if (adminPassword !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Invalid admin password" },
          { status: 401 }
        );
      }
      return NextResponse.json({
        id: "admin",
        name: "Admin",
        email: "admin@cercle.ai",
        role: "admin",
        plan: "premium",
        points: 0,
        level: 99,
        streak: 0,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
