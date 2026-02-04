import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightDetailProps {
  title: string;
  icon?: React.ReactNode;
  items: Array<{
    label: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }>;
}

export function InsightDetail({ title, icon, items }: InsightDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                item.color
                  ? `bg-${item.color}-50 border-${item.color}-200`
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}