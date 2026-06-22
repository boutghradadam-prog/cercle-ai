import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { subject, topic, count, difficulty } = await req.json();
    const numQuestions = count || 5;
    const diff = difficulty || "medium";

    const prompt = `Generate ${numQuestions} multiple-choice ${subject} quiz questions about "${topic || "general " + subject}" at ${diff} difficulty level.

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks):
[
  {
    "id": "q1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of the correct answer"
  }
]

Make sure correctIndex is 0-3 (zero-based index of the correct option in the options array). Questions should be educational, accurate, and appropriate for the difficulty level.`;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cercle-ai.vercel.app",
        "X-Title": "Cercle AI Quiz Generator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Extract JSON from the response
    let questions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      questions = [];
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
