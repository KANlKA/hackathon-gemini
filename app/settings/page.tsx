"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Settings as SettingsIcon,
  RotateCcw,
  Trash2,
  AlertCircle,
  Edit3,
  Save,
  X,
  CheckCircle,
  LogIn,
  RefreshCw,
  Clock,
  Calendar,
  Globe,
  Target,
  Filter,
  Film,
  Shield,
  Link2,
  Unlink,
} from "lucide-react";
import { toast } from "sonner";

type Settings = {
  emailEnabled: boolean;
  emailFrequency: "weekly" | "biweekly" | "monthly";
  emailDay: string;
  emailTime: string;
  timezone: string;
  ideaCount: number;
  preferences?: {
    focusAreas?: string[];
    avoidTopics?: string[];
    preferredFormats?: string[];
  };
};

type EmailLog = {
  id: string;
  subject: string;
  recipientEmail: string;
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed";
  ideaCount: number;
  sentAt: string;
  deliveredAt?: string;
  openedAt?: string;
  failureReason?: string;
};

type SyncStatus = {
  syncStatus: string;
  lastSyncedAt: string;
  channelName?: string;
  isConnected: boolean;
};

const joinList = (values?: string[]) =>
  values && values.length > 0 ? values.join(", ") : "";

const splitList = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editedSettings, setEditedSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [emailHistory, setEmailHistory] = useState<EmailLog[]>([]);
  const [syncData, setSyncData] = useState<SyncStatus | null>(null);
  const [alertMessage, setAlertMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  const timezones = useMemo(
    () => [
      "UTC",
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Asia/Kolkata",
      "Asia/Singapore",
      "Australia/Sydney",
    ],
    []
  );

  // Load settings
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      loadSettings();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setAlertMessage({
        type: "info",
        message: "Please sign in to access settings.",
      });
    }
  }, [status, session?.user?.email]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setAlertMessage(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch("/api/settings/preferences", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.status === 401) {
        if (loadAttempts < 2) {
          setLoadAttempts((prev) => prev + 1);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          loadSettings();
          return;
        } else {
          await signIn();
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to load settings");
      }

      const data = await response.json();

      if (!data.settings) {
        throw new Error("No settings data received");
      }

      setSettings(data.settings);
      setEditedSettings(data.settings);
      setLoadAttempts(0);
    } catch (error) {
      console.error("Error loading settings:", error);
      const errorMsg = (error as Error).message || "Failed to load settings";

      if (loadAttempts < 1) {
        setAlertMessage({
          type: "info",
          message: "Refreshing session...",
        });
        setLoadAttempts((prev) => prev + 1);
        setTimeout(() => loadSettings(), 1000);
      } else {
        setAlertMessage({
          type: "error",
          message: errorMsg,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load additional data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyRes, syncRes] = await Promise.all([
          fetch("/api/email/history?limit=10&page=1"),
          fetch("/api/youtube/history"),
        ]);

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setEmailHistory(historyData.emails || []);
          setTotalPages(historyData.pagination?.pages || 1);
        }

        if (syncRes.ok) {
          const syncData = await syncRes.json();
          setSyncData(syncData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (status === "authenticated") {
      loadData();
    }
  }, [status]);

  // Load email history pagination
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/email/history?limit=10&page=${historyPage}`);
        if (res.ok) {
          const data = await res.json();
          setEmailHistory(data.emails || []);
        }
      } catch (error) {
        console.error("Error loading email history:", error);
      }
    };

    if (status === "authenticated") {
      loadHistory();
    }
  }, [historyPage, status]);

  const handleSaveSettings = async () => {
    if (!editedSettings) return;
    setSaving(true);
    try {
      const response = await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ settings: editedSettings }),
      });

      if (response.status === 401) {
        toast.error("Session expired. Please sign in again.");
        await signIn();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      const data = await response.json();
      setSettings(data.settings);
      setEditedSettings(data.settings);
      setIsEditMode(false);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error((error as Error).message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedSettings(settings);
    setIsEditMode(false);
  };

  const getStatusColor = (status: EmailLog["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-blue-600 text-white";
      case "opened":
        return "bg-green-600 text-white";
      case "clicked":
        return "bg-green-700 text-white";
      case "bounced":
        return "bg-orange-600 text-white";
      case "failed":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-20" />
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-12 w-64 bg-zinc-800" />
          <Skeleton className="h-96 bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-20" />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Card className="bg-red-950/20 border-red-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <Shield className="h-5 w-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                You need to be logged in to access settings.
              </p>
              <Button
                onClick={() => signIn()}
                className="bg-red-600 hover:bg-red-700 gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!settings || !editedSettings) {
    return (
      <div className="min-h-screen bg-black">
        <div className="h-20" />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Card className="bg-red-950/20 border-red-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                Error Loading Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                {alertMessage?.message || "There was a problem loading your settings."}
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  onClick={() => {
                    setLoadAttempts(0);
                    loadSettings();
                  }}
                  className="bg-red-600 hover:bg-red-700 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => signIn()}
                  variant="outline"
                  className="gap-2 border-zinc-700 text-gray-300"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar space */}
      <div className="h-20" />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Settings</h1>
              <p className="text-gray-400 mt-1">
                Manage your preferences and email notifications
              </p>
            </div>
          </div>

          {!isEditMode ? (
            <Button
              onClick={() => setIsEditMode(true)}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Settings
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                size="lg"
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="lg"
                className="gap-2 border-zinc-700 text-gray-300"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Alerts */}
        {alertMessage && (
          <Card
            className={
              alertMessage.type === "success"
                ? "bg-green-950/20 border-green-900/50"
                : alertMessage.type === "error"
                ? "bg-red-950/20 border-red-900/50"
                : "bg-blue-950/20 border-blue-900/50"
            }
          >
            <CardContent className="pt-6 flex items-center gap-3">
              {alertMessage.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
              ) : alertMessage.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
              )}
              <p
                className={
                  alertMessage.type === "success"
                    ? "text-green-400"
                    : alertMessage.type === "error"
                    ? "text-red-400"
                    : "text-blue-400"
                }
              >
                {alertMessage.message}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Email Preferences */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Mail className="h-6 w-6 text-purple-400" />
              Email Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {!isEditMode ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-purple-950/20 rounded-xl border-2 border-purple-900/30">
                  <span className="font-semibold text-white text-lg">
                    Weekly Email Notifications
                  </span>
                  <Badge
                    className={
                      editedSettings.emailEnabled
                        ? "bg-green-600 text-white text-base px-4 py-2"
                        : "bg-gray-700 text-gray-300 text-base px-4 py-2"
                    }
                  >
                    {editedSettings.emailEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                {editedSettings.emailEnabled && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Frequency
                        </p>
                      </div>
                      <p className="font-semibold text-white text-lg capitalize">
                        {editedSettings.emailFrequency}
                      </p>
                    </div>

                    <div className="p-5 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-5 w-5 text-green-400" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Day
                        </p>
                      </div>
                      <p className="font-semibold text-white text-lg capitalize">
                        {editedSettings.emailDay}
                      </p>
                    </div>

                    <div className="p-5 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-5 w-5 text-purple-400" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Time
                        </p>
                      </div>
                      <p className="font-semibold text-white text-lg">
                        {editedSettings.emailTime}
                      </p>
                    </div>

                    <div className="p-5 bg-zinc-800/50 rounded-xl border border-zinc-700">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-orange-400" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          Timezone
                        </p>
                      </div>
                      <p className="font-semibold text-white text-sm">
                        {editedSettings.timezone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <label className="flex items-center gap-4 p-5 bg-purple-950/20 rounded-xl border-2 border-purple-900/30 cursor-pointer hover:bg-purple-950/30 transition-all">
                  <input
                    type="checkbox"
                    checked={editedSettings.emailEnabled}
                    onChange={(e) =>
                      setEditedSettings({
                        ...editedSettings,
                        emailEnabled: e.target.checked,
                      })
                    }
                    className="w-6 h-6 rounded cursor-pointer accent-purple-600"
                  />
                  <span className="font-semibold text-white text-lg">
                    Enable weekly email insights
                  </span>
                </label>

                {editedSettings.emailEnabled && (
                  <div className="grid md:grid-cols-2 gap-6 p-6 bg-zinc-800/30 rounded-xl border-2 border-zinc-700">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        Frequency
                      </label>
                      <select
                        value={editedSettings.emailFrequency}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            emailFrequency: e.target.value as any,
                          })
                        }
                        className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-400" />
                        Day of Week
                      </label>
                      <select
                        value={editedSettings.emailDay}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            emailDay: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        {[
                          "sunday",
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                          "saturday",
                        ].map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-400" />
                        Time of Day
                      </label>
                      <input
                        type="time"
                        value={editedSettings.emailTime}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            emailTime: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-orange-400" />
                        Timezone
                      </label>
                      <select
                        value={editedSettings.timezone}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            timezone: e.target.value,
                          })
                        }
                        className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        {timezones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-pink-400" />
                        Number of Ideas per Email
                      </label>
                      <select
                        value={editedSettings.ideaCount}
                        onChange={(e) =>
                          setEditedSettings({
                            ...editedSettings,
                            ideaCount: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value={3}>3 ideas</option>
                        <option value={5}>5 ideas</option>
                        <option value={10}>10 ideas</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Preferences */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <div>
              <CardTitle className="flex items-center gap-2 text-white text-2xl mb-2">
                <Filter className="h-6 w-6 text-blue-400" />
                Content Preferences
              </CardTitle>
              <p className="text-sm text-gray-400">
                Filter which video ideas are sent to you in emails
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {!isEditMode ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-blue-950/20 rounded-xl border-2 border-blue-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-blue-400" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Focus Areas
                    </p>
                  </div>
                  <p className="font-medium text-white text-sm">
                    {joinList(editedSettings.preferences?.focusAreas) || "None set"}
                  </p>
                </div>

                <div className="p-5 bg-red-950/20 rounded-xl border-2 border-red-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <X className="h-5 w-5 text-red-400" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Avoid Topics
                    </p>
                  </div>
                  <p className="font-medium text-white text-sm">
                    {joinList(editedSettings.preferences?.avoidTopics) || "None set"}
                  </p>
                </div>

                <div className="p-5 bg-green-950/20 rounded-xl border-2 border-green-900/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Film className="h-5 w-5 text-green-400" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Preferred Formats
                    </p>
                  </div>
                  <p className="font-medium text-white text-sm">
                    {joinList(editedSettings.preferences?.preferredFormats) || "None set"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    Focus Areas
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., AI, Machine Learning, Python"
                    value={joinList(editedSettings.preferences?.focusAreas)}
                    onChange={(e) =>
                      setEditedSettings({
                        ...editedSettings,
                        preferences: {
                          ...editedSettings.preferences,
                          focusAreas: splitList(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Comma-separated list</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    Avoid Topics
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Politics, Religion"
                    value={joinList(editedSettings.preferences?.avoidTopics)}
                    onChange={(e) =>
                      setEditedSettings({
                        ...editedSettings,
                        preferences: {
                          ...editedSettings.preferences,
                          avoidTopics: splitList(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Comma-separated list</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Film className="h-4 w-4 text-green-400" />
                    Preferred Formats
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., tutorial, vlog, deep-dive"
                    value={joinList(editedSettings.preferences?.preferredFormats)}
                    onChange={(e) =>
                      setEditedSettings({
                        ...editedSettings,
                        preferences: {
                          ...editedSettings.preferences,
                          preferredFormats: splitList(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">Comma-separated list</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email History */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Mail className="h-6 w-6 text-indigo-400" />
              Email History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {emailHistory.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No emails sent yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Your email history will appear here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b-2 border-zinc-800">
                    <tr>
                      <th className="text-left py-4 px-4 font-semibold text-gray-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-400 uppercase tracking-wide">
                        Subject
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-400 uppercase tracking-wide">
                        Ideas
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-400 uppercase tracking-wide">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailHistory.map((email) => (
                      <tr
                        key={email.id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(email.status)}>
                            {email.status.charAt(0).toUpperCase() +
                              email.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-white">{email.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {email.recipientEmail}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-white font-semibold">
                            {email.ideaCount}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-white">
                              {new Date(email.sentAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(email.sentAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={historyPage === 1}
                      onClick={() => setHistoryPage(Math.max(1, historyPage - 1))}
                      className="border-zinc-700 text-gray-300"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-400">
                      Page {historyPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={historyPage === totalPages}
                      onClick={() =>
                        setHistoryPage(Math.min(totalPages, historyPage + 1))
                      }
                      className="border-zinc-700 text-gray-300"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Channel Management */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="flex items-center gap-2 text-white text-2xl">
              <Link2 className="h-6 w-6 text-red-400" />
              Channel Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Sync Status</p>
                  <p className="font-semibold text-white capitalize">
                    {syncData?.syncStatus || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Last Synced</p>
                  <p className="font-semibold text-white">
                    {syncData?.lastSyncedAt
                      ? new Date(syncData.lastSyncedAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {!syncData?.isConnected && (
                <div className="p-4 bg-yellow-950/20 border border-yellow-900/30 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    Your YouTube channel is disconnected. Connect again to receive
                    personalized video ideas.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={async () => {
                  await fetch("/api/youtube/sync", { method: "POST" });
                  const res = await fetch("/api/youtube/history");
                  const data = await res.json();
                  setSyncData(data);
                  toast.success("Channel re-sync initiated");
                }}
                className="bg-purple-600 hover:bg-purple-700 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Re-sync Channel
              </Button>

              <Button
                onClick={async () => {
                  if (syncData?.isConnected) {
                    if (
                      confirm(
                        "Are you sure you want to disconnect your YouTube channel?"
                      )
                    ) {
                      await fetch("/api/youtube/disconnect", { method: "POST" });
                      toast.success("Channel disconnected");
                      setSyncData((prev) => ({
                        ...(prev as SyncStatus),
                        isConnected: false,
                        syncStatus: "disconnected",
                      }));
                    }
                  } else {
                    await fetch("/api/youtube/connect", { method: "POST" });
                    toast.success("Channel connected");
                    setSyncData((prev) => ({
                      ...(prev as SyncStatus),
                      isConnected: true,
                      syncStatus: "connected",
                      lastSyncedAt: new Date().toISOString(),
                    }));
                  }
                }}
                variant="outline"
                className={
                  syncData?.isConnected
                    ? "border-red-700 text-red-400 hover:bg-red-950/20 gap-2"
                    : "border-purple-700 text-purple-400 hover:bg-purple-950/20 gap-2"
                }
              >
                {syncData?.isConnected ? (
                  <>
                    <Unlink className="h-4 w-4" />
                    Disconnect Channel
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Connect Channel
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}