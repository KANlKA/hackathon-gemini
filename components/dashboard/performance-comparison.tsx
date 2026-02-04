import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceItem {
  label: string;
  engagement: number;
  count?: number;
}

interface PerformanceComparisonProps {
  working: PerformanceItem[];
  notWorking: PerformanceItem[];
}

export function PerformanceComparison({
  working,
  notWorking,
}: PerformanceComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* What's Working */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
              <TrendingUp className="h-5 w-5" />
              What's Working
            </h3>
            <div className="space-y-2">
              {working.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-green-700">
                      {(item.engagement * 100).toFixed(1)}%
                    </span>
                  </div>
                  {item.count && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.count} videos
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What's Not Working */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
              <TrendingDown className="h-5 w-5" />
              What's Not Working
            </h3>
            <div className="space-y-2">
              {notWorking.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-sm text-red-700">
                      {(item.engagement * 100).toFixed(1)}%
                    </span>
                  </div>
                  {item.count && (
                    <p className="text-xs text-gray-600 mt-1">
                      {item.count} videos
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}