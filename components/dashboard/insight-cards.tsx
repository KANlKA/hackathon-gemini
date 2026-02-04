import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface InsightCardsProps {
  insights: Array<{
    text: string;
    type: "positive" | "negative" | "neutral";
  }>;
}

export function InsightCards({ insights }: InsightCardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          🎯 Your Top Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-lg ${
              insight.type === "positive"
                ? "bg-green-50 border border-green-200"
                : insight.type === "negative"
                ? "bg-red-50 border border-red-200"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <span className="font-medium">{insight.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}