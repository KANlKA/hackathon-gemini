import { generateJSON } from "./gemini";

interface VideoAnalysis {
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

interface CommentAnalysis {
  sentiment: "positive" | "neutral" | "negative";
  intent: "question" | "praise" | "request" | "criticism" | "confusion";
  topics: string[];
}

export async function analyzeVideo(data: {
  title: string;
  description: string;
  transcript: string;
}): Promise<VideoAnalysis> {
  const prompt = `Analyze this YouTube video and extract structured information.

Title: ${data.title}
Description: ${data.description}
Transcript: ${data.transcript.slice(0, 5000)} ${data.transcript.length > 5000 ? "..." : ""}

Extract the following information and return as JSON:
{
  "topic": "main topic (2-3 words)",
  "subtopics": ["subtopic1", "subtopic2", "subtopic3"],
  "tone": "educational | entertaining | controversial | storytelling | inspirational",
  "hookType": "problem-statement | surprising-fact | question | story | direct",
  "audienceIntent": "learning | entertainment | exploration",
  "complexity": "beginner | intermediate | advanced",
  "format": "deep-dive | tutorial | listicle | vlog | review | comparison | news",
  "structure": "problem-solution | chronological | compare-contrast | how-to | story-based"
}`;

  try {
    const analysis = await generateJSON(prompt);
    return analysis;
  } catch (error) {
    console.error("Error analyzing video:", error);
    // Return default analysis on error
    return {
      topic: "general",
      subtopics: [],
      tone: "educational",
      hookType: "direct",
      audienceIntent: "learning",
      complexity: "intermediate",
      format: "general",
      structure: "general",
    };
  }
}

export async function analyzeComment(text: string): Promise<CommentAnalysis> {
  const prompt = `Analyze this YouTube comment:

"${text}"

Extract the following and return as JSON:
{
  "sentiment": "positive | neutral | negative",
  "intent": "question | praise | request | criticism | confusion",
  "topics": ["topic1", "topic2"]
}`;

  try {
    const analysis = await generateJSON(prompt);
    return analysis;
  } catch (error) {
    console.error("Error analyzing comment:", error);
    // Return default analysis on error
    return {
      sentiment: "neutral",
      intent: "praise",
      topics: [],
    };
  }
}

export async function analyzeCommentBatch(
  comments: string[]
): Promise<CommentAnalysis[]> {
  const prompt = `Analyze these YouTube comments:

${comments.map((c, i) => `${i + 1}. "${c}"`).join("\n")}

For each comment, extract sentiment, intent, and topics.
Return as JSON array:
[
  {
    "sentiment": "positive | neutral | negative",
    "intent": "question | praise | request | criticism | confusion",
    "topics": ["topic1", "topic2"]
  }
]`;

  try {
    const analyses = await generateJSON(prompt);
    return analyses;
  } catch (error) {
    console.error("Error analyzing comment batch:", error);
    // Return default analyses
    return comments.map(() => ({
      sentiment: "neutral" as const,
      intent: "praise" as const,
      topics: [],
    }));
  }
}