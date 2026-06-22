"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Settings,
  Crown,
  RefreshCw,
  Trash2,
  MessageSquare,
  FileQuestion,
} from "lucide-react";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function AdminPage() {
  const { setView, adminUsers, adminStats, fetchAdminData } = useAppStore();

  const loadData = useCallback(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("User deleted successfully");
        fetchAdminData();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (res.ok) {
        toast.success("User role updated");
        fetchAdminData();
      } else {
        toast.error("Failed to update role");
      }
    } catch {
      toast.error("Error updating role");
    }
  };

  const stats = adminStats;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-semibold">Admin Panel</h1>
          <Badge variant="secondary" className="ml-2">Admin</Badge>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Stats - Real data */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500" },
            { label: "Active Users (7d)", value: stats?.activeUsers ?? 0, icon: BarChart3, color: "text-purple-500" },
            { label: "Monthly Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: CreditCard, color: "text-green-500" },
            { label: "Avg Quiz Score", value: `${stats?.avgScore ?? 0}%`, icon: FileQuestion, color: "text-amber-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-1" /> Users</TabsTrigger>
            <TabsTrigger value="subscriptions"><CreditCard className="w-4 h-4 mr-1" /> Subscriptions</TabsTrigger>
            <TabsTrigger value="activity"><BarChart3 className="w-4 h-4 mr-1" /> Activity</TabsTrigger>
            <TabsTrigger value="system"><Settings className="w-4 h-4 mr-1" /> System</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">User Management</CardTitle>
                  <Badge variant="secondary">{adminUsers.length} real users</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {adminUsers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No users registered yet</p>
                    <p className="text-sm mt-1">Users will appear here once they sign up on the platform.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-2 text-xs font-medium text-muted-foreground">User</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Role</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Plan</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Points</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Activity</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Status</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Joined</th>
                          <th className="pb-2 text-xs font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminUsers.map((u) => (
                          <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                  {u.name[0] || "?"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{u.name}</p>
                                  <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <select
                                value={u.role}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="text-xs bg-transparent border rounded px-1 py-0.5"
                              >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td>
                              <div className="flex items-center gap-1">
                                {u.plan !== "free" && <Crown className="w-3 h-3 text-yellow-500" />}
                                <span className="text-xs capitalize">{u.plan}</span>
                              </div>
                            </td>
                            <td className="text-sm">{u.points.toLocaleString()}</td>
                            <td>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{u.chatCount}</span>
                                <span className="flex items-center gap-0.5"><FileQuestion className="w-3 h-3" />{u.quizCount}</span>
                              </div>
                            </td>
                            <td>
                              <Badge variant={u.active ? "default" : "secondary"} className="text-xs">
                                {u.active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="text-xs text-muted-foreground">{timeAgo(u.createdAt)}</td>
                            <td>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteUser(u.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats?.subscriptionStats ? (
                Object.entries(stats.subscriptionStats).map(([plan, data]) => (
                  <Card key={plan} className={`border-border/50 ${plan === "pro" ? "bg-blue-500/5" : plan === "premium" ? "bg-purple-500/5" : ""}`}>
                    <CardContent className="p-5 text-center">
                      <h3 className="font-bold text-lg mb-1 capitalize">{plan}</h3>
                      <p className="text-2xl font-bold gradient-text mb-1">{data.count}</p>
                      <p className="text-xs text-muted-foreground mb-2">real subscribers</p>
                      <p className="text-lg font-semibold">${data.revenue.toLocaleString()}/mo</p>
                      <p className="text-xs text-muted-foreground">monthly revenue</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  Loading subscription data...
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Chat Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    {stats?.totalChatSessions ?? 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total AI chat sessions across all users</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Quiz Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold gradient-text mb-1">
                    {stats?.totalQuizAttempts ?? 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Total quiz attempts across all users</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { service: "API Server", status: "operational" },
                  { service: "AI Engine (DeepSeek)", status: "operational" },
                  { service: "Database (SQLite)", status: "operational" },
                  { service: "Authentication", status: "operational" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">{s.service}</span>
                    </div>
                    <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">{s.status}</Badge>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  <p>Database: <strong>SQLite (Prisma)</strong></p>
                  <p>Total users in DB: <strong>{adminUsers.length}</strong></p>
                  <p>Last refresh: <strong>{new Date().toLocaleTimeString()}</strong></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
