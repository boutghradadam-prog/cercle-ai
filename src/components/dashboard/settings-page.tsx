"use client";

import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  User,
  Globe,
  Bell,
  Palette,
  Shield,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

export function SettingsPage() {
  const { user, setView } = useAppStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [language, setLanguage] = useState(user?.language || "en");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => setView("dashboard")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold">Settings</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile"><User className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
            <TabsTrigger value="language"><Globe className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Language</span></TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Alerts</span></TabsTrigger>
            <TabsTrigger value="security"><Shield className="w-4 h-4 mr-1 sm:mr-2" /><span className="hidden sm:inline">Security</span></TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {name[0] || "U"}
                  </div>
                  <div>
                    <h3 className="font-semibold">{name || "User"}</h3>
                    <p className="text-sm text-muted-foreground">{email}</p>
                    <p className="text-xs text-primary capitalize">{user?.plan} Plan</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
                <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  <Save className="w-4 h-4 mr-1" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Choose your preferred language for the interface and AI tutor responses.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        language === lang.code
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                      onClick={() => setLanguage(lang.code)}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  <Save className="w-4 h-4 mr-1" /> Save Language
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Get notified about streaks and achievements</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Weekly progress reports and tips</p>
                  </div>
                  <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                </div>
                <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  <Save className="w-4 h-4 mr-1" /> Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                  <Shield className="w-4 h-4 mr-1" /> Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
