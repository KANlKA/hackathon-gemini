"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Mail, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data.settings);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Email Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Frequency */}
            <div>
              <Label htmlFor="frequency" className="text-base font-semibold mb-2 block">
                How often should we send you ideas?
              </Label>
              <Select
                value={settings.emailFrequency}
                onValueChange={(value) =>
                  setSettings({ ...settings, emailFrequency: value })
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Day of Week */}
            <div>
              <Label htmlFor="day" className="text-base font-semibold mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Which day?
              </Label>
              <Select
                value={settings.emailDay}
                onValueChange={(value) =>
                  setSettings({ ...settings, emailDay: value })
                }
              >
                <SelectTrigger id="day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div>
              <Label htmlFor="time" className="text-base font-semibold mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                What time?
              </Label>
              <Input
                id="time"
                type="time"
                value={settings.emailTime}
                onChange={(e) =>
                  setSettings({ ...settings, emailTime: e.target.value })
                }
              />
            </div>

            {/* Timezone */}
            <div>
              <Label htmlFor="timezone" className="text-base font-semibold mb-2 block">
                Timezone
              </Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  setSettings({ ...settings, timezone: value })
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Ideas */}
            <div>
              <Label htmlFor="ideaCount" className="text-base font-semibold mb-2 block">
                How many ideas per email?
              </Label>
              <Select
                value={settings.ideaCount.toString()}
                onValueChange={(value) =>
                  setSettings({ ...settings, ideaCount: parseInt(value) })
                }
              >
                <SelectTrigger id="ideaCount">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 ideas</SelectItem>
                  <SelectItem value="5">5 ideas</SelectItem>
                  <SelectItem value="10">10 ideas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-700">
              <strong>Preview:</strong> You'll receive{" "}
              <span className="font-semibold">{settings.ideaCount} video ideas</span>{" "}
              every{" "}
              <span className="font-semibold capitalize">
                {settings.emailFrequency === "weekly"
                  ? settings.emailDay
                  : settings.emailFrequency === "biweekly"
                  ? `other ${settings.emailDay}`
                  : `${settings.emailDay} of the month`}
              </span>{" "}
              at{" "}
              <span className="font-semibold">
                {settings.emailTime} {settings.timezone}
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}