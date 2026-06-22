import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Save chat session
export async function POST(req: NextRequest) {
  try {
    const { action, userId, subject, title, messages } = await req.json();

    if (action === "save-chat") {
      if (!userId || !subject || !title) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const session = await db.chatSession.create({
        data: {
          userId,
          subject,
          title,
          messages: JSON.stringify(messages),
        },
      });

      // Update user points (+5 per chat) and last active
      const user = await db.user.findUnique({ where: { id: userId } });
      if (user) {
        const newPoints = user.points + 5;
        const newLevel = Math.floor(newPoints / 100) + 1;
        await db.user.update({
          where: { id: userId },
          data: {
            points: newPoints,
            level: newLevel,
            lastActiveAt: new Date(),
          },
        });

        // Check for "First Steps" badge
        const firstStepsBadge = await db.badge.findFirst({ where: { name: "First Steps" } });
        if (firstStepsBadge) {
          const alreadyEarned = await db.userBadge.findFirst({
            where: { userId, badgeId: firstStepsBadge.id },
          });
          if (!alreadyEarned) {
            await db.userBadge.create({
              data: { userId, badgeId: firstStepsBadge.id },
            });
          }
        }

        // Check for "Math Explorer" badge
        if (subject === "math") {
          const mathChats = await db.chatSession.count({ where: { userId, subject: "math" } });
          if (mathChats >= 10) {
            const mathBadge = await db.badge.findFirst({ where: { name: "Math Explorer" } });
            if (mathBadge) {
              const alreadyEarned = await db.userBadge.findFirst({
                where: { userId, badgeId: mathBadge.id },
              });
              if (!alreadyEarned) {
                await db.userBadge.create({
                  data: { userId, badgeId: mathBadge.id },
                });
              }
            }
          }
        }
      }

      return NextResponse.json({ sessionId: session.id, pointsEarned: 5 });
    }

    if (action === "save-quiz") {
      const { userId: uid, subject: subj, score, total, answers } = await req.json();

      if (!uid || !subj || score === undefined || !total) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const attempt = await db.quizAttempt.create({
        data: {
          userId: uid,
          subject: subj,
          score,
          total,
          answers: JSON.stringify(answers || []),
        },
      });

      // Update user points (+10 per quiz, bonus for high scores)
      const user = await db.user.findUnique({ where: { id: uid } });
      if (user) {
        const percentage = score / total;
        let pointsEarned = 10;
        if (percentage >= 0.9) pointsEarned = 25;
        else if (percentage >= 0.7) pointsEarned = 15;

        const newPoints = user.points + pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;
        await db.user.update({
          where: { id: uid },
          data: {
            points: newPoints,
            level: newLevel,
            lastActiveAt: new Date(),
          },
        });

        // Check for "Quiz Champion" badge (90%+ on 5 quizzes)
        if (percentage >= 0.9) {
          const highScoreQuizzes = await db.quizAttempt.count({
            where: { userId: uid, score: { gte: 0 } },
          });
          // Count quizzes with 90%+ manually
          const allQuizAttempts = await db.quizAttempt.findMany({ where: { userId: uid } });
          const ninetyPlusCount = allQuizAttempts.filter((q) => q.score / q.total >= 0.9).length;

          if (ninetyPlusCount >= 5) {
            const quizBadge = await db.badge.findFirst({ where: { name: "Quiz Champion" } });
            if (quizBadge) {
              const alreadyEarned = await db.userBadge.findFirst({
                where: { userId: uid, badgeId: quizBadge.id },
              });
              if (!alreadyEarned) {
                await db.userBadge.create({ data: { userId: uid, badgeId: quizBadge.id } });
              }
            }
          }
        }

        // Check for "Perfectionist" badge (100% on any quiz)
        if (score === total) {
          const perfBadge = await db.badge.findFirst({ where: { name: "Perfectionist" } });
          if (perfBadge) {
            const alreadyEarned = await db.userBadge.findFirst({
              where: { userId: uid, badgeId: perfBadge.id },
            });
            if (!alreadyEarned) {
              await db.userBadge.create({ data: { userId: uid, badgeId: perfBadge.id } });
            }
          }
        }

        return NextResponse.json({ attemptId: attempt.id, pointsEarned });
      }

      return NextResponse.json({ attemptId: attempt.id, pointsEarned: 10 });
    }

    // Update progress
    if (action === "update-progress") {
      const { userId: uid, subject: subj, topic, mastery, completed, total } = await req.json();

      if (!uid || !subj || !topic) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const existing = await db.progress.findFirst({
        where: { userId: uid, subject: subj, topic },
      });

      if (existing) {
        await db.progress.update({
          where: { id: existing.id },
          data: {
            mastery: mastery ?? existing.mastery,
            completed: completed ?? existing.completed,
            total: total ?? existing.total,
          },
        });
      } else {
        await db.progress.create({
          data: {
            userId: uid,
            subject: subj,
            topic,
            mastery: mastery || 0,
            completed: completed || 0,
            total: total || 5,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
