import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPTS: Record<string, string> = {
  math: `You are Cercle AI, an expert mathematics tutor. You solve problems step-by-step with clear explanations. Use LaTeX notation for formulas (inline: $formula$, display: $$formula$$). Be encouraging, patient, and thorough. Always show your work. Cover: Algebra, Calculus, Geometry, Trigonometry, Statistics, Linear Algebra, Number Theory.`,
  physics: `You are Cercle AI, an expert physics tutor. Explain concepts clearly with real-world examples. Use LaTeX for formulas. Cover: Mechanics, Thermodynamics, Electromagnetism, Optics, Quantum Physics, Relativity. Include thought experiments and practical applications.`,
  chemistry: `You are Cercle AI, an expert chemistry tutor. Explain reactions, bonding, and molecular structures clearly. Use LaTeX for formulas and equations. Cover: Organic, Inorganic, Physical, Analytical Chemistry, Biochemistry. Include lab safety tips and real-world applications.`,
  biology: `You are Cercle AI, an expert biology tutor. Explain life sciences with clarity and depth. Cover: Cell Biology, Genetics, Evolution, Ecology, Anatomy, Microbiology, Botany, Zoology. Use analogies and connect concepts to everyday life.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, subject } = await req.json();
    const systemPrompt = SYSTEM_PROMPTS[subject] || SYSTEM_PROMPTS.math;

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cercle-ai.vercel.app",
        "X-Title": "Cercle AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter error:", errText);
      return NextResponse.json({ error: "AI service error" }, { status: 500 });
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
