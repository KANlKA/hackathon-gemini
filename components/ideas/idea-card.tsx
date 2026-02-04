import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface IdeaCardProps {
  idea: {
    rank: number;
    title: string;
    reasoning: {
      commentDemand: string;
      pastPerformance: string;
      audienceFit: string;
    };
    predictedEngagement: number;
    confidence: number;
  };
  index: number;
}

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const rankEmojis = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
  const confidenceColor =
    idea.confidence >= 0.8
      ? "bg-green-100 text-green-700 border-green-300"
      : idea.confidence >= 0.6
      ? "bg-yellow-100 text-yellow-700 border-yellow-300"
      : "bg-orange-100 text-orange-700 border-orange-300";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{rankEmojis[index]}</span>
          <Badge variant="outline">Idea #{idea.rank}</Badge>
        </div>
        <CardTitle className="text-2xl">{idea.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Predicted Engagement</p>
              <p className="text-2xl font-bold text-blue-600">
                {(idea.predictedEngagement * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border ${confidenceColor}`}
          >
            <Sparkles className="h-8 w-8" />
            <div>
              <p className="text-sm">Confidence Score</p>
              <p className="text-2xl font-bold">
                {(idea.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">💡 Why This Will Work</h3>
          <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-orange-500 mt-1">•</span>
              <p className="text-gray-700">{idea.reasoning.commentDemand}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <p className="text-gray-700">{idea.reasoning.pastPerformance}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <p className="text-gray-700">{idea.reasoning.audienceFit}</p>
            </div>
          </div>
        </div>

        <Link href={`/ideas/${index}`}>
          <Button className="w-full" variant="outline">
            View Full Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}