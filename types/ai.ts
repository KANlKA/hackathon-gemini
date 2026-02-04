export interface VideoAnalysis {
  topic: string;
  subtopics: string[];
  tone: string;
  hookType: string;
  audienceIntent: string;
  complexity: string;
  format: string;
  structure: string;
  visualStyle?: string;
}

export interface CommentAnalysis {
  sentiment: "positive" | "neutral" | "negative";
  intent: "question" | "praise" | "request" | "criticism" | "confusion";
  topics: string[];
}

export interface VideoIdea {
  rank: number;
  title: string;
  reasoning: {
    commentDemand: string;
    pastPerformance: string;
    trendingScore: number;
    audienceFit: string;
  };
  evidence: Array<{
    type: "comment" | "performance" | "trend";
    text: string;
    videoId?: string;
    commentId?: string;
  }>;
  predictedEngagement: number;
  confidence: number;
  suggestedStructure: {
    hook: string;
    format: string;
    length: string;
    tone: string;
  };
}