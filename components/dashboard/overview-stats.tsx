import { Card, CardContent } from "@/components/ui/card";
import { Video, MessageSquare, TrendingUp, Sparkles } from "lucide-react";

interface OverviewStatsProps {
  totalVideos: number;
  avgEngagement: number;
  totalViews: number;
  ideasGenerated: number;
}

export function OverviewStats({
  totalVideos,
  avgEngagement,
  totalViews,
  ideasGenerated,
}: OverviewStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <StatCard
        icon={<Video className="h-6 w-6 text-blue-600" />}
        label="Total Videos"
        value={totalVideos.toString()}
      />
      <StatCard
        icon={<MessageSquare className="h-6 w-6 text-green-600" />}
        label="Avg Engagement"
        value={`${(avgEngagement * 100).toFixed(1)}%`}
      />
      <StatCard
        icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
        label="Total Views"
        value={totalViews.toLocaleString()}
      />
      <StatCard
        icon={<Sparkles className="h-6 w-6 text-yellow-600" />}
        label="Ideas Generated"
        value={ideasGenerated.toString()}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}