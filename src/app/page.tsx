"use client";

import { useAppStore, type ViewMode, type Subject, type ChatMessage } from "@/store/useAppStore";
import { LandingPage } from "@/components/landing/landing-page";
import { AuthPage } from "@/components/landing/auth-page";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ChatPage } from "@/components/chat/chat-page";
import { QuizPage } from "@/components/quiz/quiz-page";
import { ProgressPage } from "@/components/dashboard/progress-page";
import { AdminPage } from "@/components/admin/admin-page";
import { PricingPage } from "@/components/landing/pricing-page";
import { SettingsPage } from "@/components/dashboard/settings-page";

export default function Home() {
  const { view } = useAppStore();

  const renderView = () => {
    switch (view) {
      case "landing":
        return <LandingPage />;
      case "auth":
        return <AuthPage />;
      case "dashboard":
        return <DashboardPage />;
      case "chat":
        return <ChatPage />;
      case "quiz":
        return <QuizPage />;
      case "progress":
        return <ProgressPage />;
      case "admin":
        return <AdminPage />;
      case "pricing":
        return <PricingPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <LandingPage />;
    }
  };

  return <main className="min-h-screen">{renderView()}</main>;
}
