"use client";

import { PerformancePatterns } from "@/components/dashboard/performance-patterns";

export default function PerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Performance Patterns</h1>
        <p className="text-gray-600">
          Deep analysis of what's working for your channel based on all your historical data
        </p>
      </div>
      
      <PerformancePatterns />
    </div>
  );
}