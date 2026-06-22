import { create } from "zustand";

export type ViewMode =
  | "landing"
  | "auth"
  | "dashboard"
  | "chat"
  | "quiz"
  | "progress"
  | "admin"
  | "pricing"
  | "settings";

export type Subject = "math" | "physics" | "chemistry" | "biology";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  plan: "free" | "pro" | "premium";
  points: number;
  level: number;
  streak: number;
  language: "en" | "fr" | "ar";
}

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

export interface SubjectProgress {
  subject: string;
  mastery: number;
  completed: number;
  total: number;
  quizCount: number;
  chatCount: number;
}

export interface ActivityItem {
  type: "chat" | "quiz";
  id: string;
  subject: string;
  title: string;
  time: string;
  score: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  points: number;
  level: number;
  streak: number;
  language: string;
  active: boolean;
  createdAt: string;
  lastActiveAt: string;
  badgeCount: number;
  quizCount: number;
  chatCount: number;
}

interface AppState {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  user: UserState | null;
  setUser: (u: UserState | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  subject: Subject;
  setSubject: (s: Subject) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;
  isChatLoading: boolean;
  setIsChatLoading: (v: boolean) => void;
  quizQuestions: QuizQuestion[];
  setQuizQuestions: (q: QuizQuestion[]) => void;
  currentQuizIndex: number;
  setCurrentQuizIndex: (i: number) => void;
  quizScore: number;
  setQuizScore: (s: number) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  authMode: "signin" | "signup" | "forgot";
  setAuthMode: (m: "signin" | "signup" | "forgot") => void;

  // Real data from DB
  badges: BadgeData[];
  setBadges: (b: BadgeData[]) => void;
  subjectProgress: SubjectProgress[];
  setSubjectProgress: (p: SubjectProgress[]) => void;
  recentActivity: ActivityItem[];
  setRecentActivity: (a: ActivityItem[]) => void;
  adminUsers: AdminUser[];
  setAdminUsers: (u: AdminUser[]) => void;
  adminStats: {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    totalQuizAttempts: number;
    totalChatSessions: number;
    avgScore: number;
    subscriptionStats: {
      free: { count: number; revenue: number };
      pro: { count: number; revenue: number };
      premium: { count: number; revenue: number };
    };
  } | null;
  setAdminStats: (s: AppState["adminStats"]) => void;

  // Fetch helpers
  fetchUserData: (userId: string) => Promise<void>;
  fetchAdminData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  view: "landing",
  setView: (v) => set({ view: v }),
  user: null,
  setUser: (u) => set({ user: u }),
  isAuthenticated: false,
  setIsAuthenticated: (v) => set({ isAuthenticated: v }),
  subject: "math",
  setSubject: (s) => set({ subject: s }),
  chatMessages: [],
  addChatMessage: (m) =>
    set((state) => ({ chatMessages: [...state.chatMessages, m] })),
  clearChat: () => set({ chatMessages: [] }),
  isChatLoading: false,
  setIsChatLoading: (v) => set({ isChatLoading: v }),
  quizQuestions: [],
  setQuizQuestions: (q) => set({ quizQuestions: q }),
  currentQuizIndex: 0,
  setCurrentQuizIndex: (i) => set({ currentQuizIndex: i }),
  quizScore: 0,
  setQuizScore: (s) => set({ quizScore: s }),
  sidebarOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  authMode: "signin",
  setAuthMode: (m) => set({ authMode: m }),

  badges: [],
  setBadges: (b) => set({ badges: b }),
  subjectProgress: [],
  setSubjectProgress: (p) => set({ subjectProgress: p }),
  recentActivity: [],
  setRecentActivity: (a) => set({ recentActivity: a }),
  adminUsers: [],
  setAdminUsers: (u) => set({ adminUsers: u }),
  adminStats: null,
  setAdminStats: (s) => set({ adminStats: s }),

  fetchUserData: async (userId: string) => {
    try {
      const res = await fetch(`/api/data?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        set({
          badges: data.badges || [],
          subjectProgress: data.progress || [],
          recentActivity: data.recentActivity || [],
        });
        // Also update user state with latest data from DB
        if (data.user) {
          set({
            user: {
              id: data.user.id,
              name: data.user.name || "",
              email: data.user.email,
              role: data.user.role,
              plan: data.user.plan,
              points: data.user.points,
              level: data.user.level,
              streak: data.user.streak,
              language: data.user.language || "en",
            },
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch user data:", e);
    }
  },

  fetchAdminData: async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        set({
          adminUsers: data.users || [],
          adminStats: {
            totalUsers: data.stats.totalUsers,
            activeUsers: data.stats.activeUsers,
            totalRevenue: data.stats.totalRevenue,
            totalQuizAttempts: data.stats.totalQuizAttempts,
            totalChatSessions: data.stats.totalChatSessions,
            avgScore: data.stats.avgScore,
            subscriptionStats: data.subscriptionStats,
          },
        });
      }
    } catch (e) {
      console.error("Failed to fetch admin data:", e);
    }
  },
}));
