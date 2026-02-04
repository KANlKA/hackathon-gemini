import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

interface CommentTheme {
  theme: string;
  mentions: number;
  type: "request" | "confusion" | "praise";
}

interface CommentThemesProps {
  themes: CommentTheme[];
}

export function CommentThemes({ themes }: CommentThemesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-orange-600" />
          💬 What Your Audience Wants
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {themes.map((theme, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              theme.type === "request"
                ? "bg-orange-50 border-orange-200"
                : theme.type === "confusion"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div>
              <p className="font-medium">{theme.theme}</p>
            </div>
            <Badge variant="secondary">{theme.mentions} mentions</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}