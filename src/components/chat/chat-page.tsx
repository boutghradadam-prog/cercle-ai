"use client";

import { useAppStore, type Subject } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Calculator,
  Atom,
  FlaskConical,
  Leaf,
  Send,
  ArrowLeft,
  ImagePlus,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const subjects: { key: Subject; label: string; icon: typeof Calculator; color: string }[] = [
  { key: "math", label: "Math", icon: Calculator, color: "from-blue-500 to-indigo-600" },
  { key: "physics", label: "Physics", icon: Atom, color: "from-purple-500 to-violet-600" },
  { key: "chemistry", label: "Chemistry", icon: FlaskConical, color: "from-emerald-500 to-teal-600" },
  { key: "biology", label: "Biology", icon: Leaf, color: "from-amber-500 to-orange-600" },
];

export function ChatPage() {
  const { user, setView, subject, setSubject, chatMessages, addChatMessage, clearChat, isChatLoading, setIsChatLoading, setUser, fetchUserData } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Save chat session when leaving the page or when messages exist
  useEffect(() => {
    return () => {
      // Save on unmount if there are messages
      if (chatMessages.length >= 2 && user?.id && user.id !== "admin" && !sessionSaved) {
        saveChatSession(chatMessages);
      }
    };
  }, []);

  const saveChatSession = async (messages: typeof chatMessages) => {
    if (messages.length < 2 || !user?.id || user.id === "admin") return;
    
    try {
      const firstUserMsg = messages.find((m) => m.role === "user");
      const title = firstUserMsg
        ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "..." : "")
        : `${subject} chat`;

      const res = await fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save-chat",
          userId: user.id,
          subject,
          title,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionSaved(true);
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
      console.error("Failed to save chat session:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isChatLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input.trim(),
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setInput("");
    setIsChatLoading(true);
    setSessionSaved(false);

    try {
      const messages = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, subject }),
      });

      const data = await res.json();

      if (data.reply) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: data.reply,
          timestamp: Date.now(),
        };
        addChatMessage(assistantMsg);

        // Auto-save session after getting a response
        const allMsgs = [...chatMessages, userMsg, assistantMsg];
        if (allMsgs.length >= 2 && user?.id && user.id !== "admin") {
          saveChatSession(allMsgs);
        }
      } else {
        addChatMessage({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I couldn't process your request. Please try again.",
          timestamp: Date.now(),
        });
      }
    } catch {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Connection error. Please check your internet and try again.",
        timestamp: Date.now(),
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearAndSave = async () => {
    if (chatMessages.length >= 2 && user?.id && user.id !== "admin" && !sessionSaved) {
      await saveChatSession(chatMessages);
    }
    clearChat();
    setSessionSaved(false);
  };

  const currentSubject = subjects.find((s) => s.key === subject) || subjects[0];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentSubject.color} flex items-center justify-center`}>
              <currentSubject.icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">{currentSubject.label} Tutor</h2>
              <p className="text-[10px] text-muted-foreground">AI-powered learning</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
              {subjects.map((s) => (
                <Button
                  key={s.key}
                  variant={subject === s.key ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs h-7 ${subject === s.key ? "bg-gradient-to-r " + s.color + " text-white border-0" : ""}`}
                  onClick={() => setSubject(s.key)}
                >
                  <s.icon className="w-3 h-3 mr-1" />
                  {s.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={handleClearAndSave}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Subject selector for mobile */}
      <div className="sm:hidden shrink-0 border-b px-4 py-2 flex gap-2 overflow-x-auto">
        {subjects.map((s) => (
          <Button
            key={s.key}
            variant={subject === s.key ? "default" : "outline"}
            size="sm"
            className={`text-xs shrink-0 ${subject === s.key ? "bg-gradient-to-r " + s.color + " text-white border-0" : ""}`}
            onClick={() => setSubject(s.key)}
          >
            <s.icon className="w-3 h-3 mr-1" />
            {s.label}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {chatMessages.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentSubject.color} flex items-center justify-center mx-auto mb-4 animate-pulse-glow`}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                {currentSubject.label} AI Tutor
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Ask me anything about {currentSubject.label.toLowerCase()}. I&apos;ll explain step-by-step with clear examples.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {subject === "math" && [
                  "Solve: x² - 5x + 6 = 0",
                  "Find the derivative of sin(x)",
                  "Calculate ∫₂⁴ x³ dx",
                  "What is the quadratic formula?",
                ].map((q, i) => (
                  <Button key={i} variant="outline" className="text-xs h-auto py-2 justify-start" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
                {subject === "physics" && [
                  "Explain Newton's second law",
                  "What is kinetic energy?",
                  "How do waves propagate?",
                  "Explain Ohm's law",
                ].map((q, i) => (
                  <Button key={i} variant="outline" className="text-xs h-auto py-2 justify-start" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
                {subject === "chemistry" && [
                  "Balance: Fe + O₂ → Fe₂O₃",
                  "What is a covalent bond?",
                  "Explain the pH scale",
                  "What is electronegativity?",
                ].map((q, i) => (
                  <Button key={i} variant="outline" className="text-xs h-auto py-2 justify-start" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
                {subject === "biology" && [
                  "Explain mitosis vs meiosis",
                  "What is DNA replication?",
                  "How does photosynthesis work?",
                  "Explain natural selection",
                ].map((q, i) => (
                  <Button key={i} variant="outline" className="text-xs h-auto py-2 justify-start" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 mb-4 message-enter ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>ol]:mb-2 [&>ul]:mb-2">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">{user?.name?.[0] || "U"}</span>
                </div>
              )}
            </div>
          ))}

          {isChatLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" title="Upload image">
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
            </Button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask your ${currentSubject.label.toLowerCase()} question...`}
                className="w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px] max-h-32"
                rows={1}
                disabled={isChatLoading}
              />
            </div>
            <Button
              size="icon"
              className="shrink-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 rounded-xl h-11 w-11"
              onClick={handleSend}
              disabled={!input.trim() || isChatLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Cercle AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
