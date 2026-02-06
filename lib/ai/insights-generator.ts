// import connectDB from "@/lib/db/mongodb";
// import Video from "@/models/Video";
// import Comment from "@/models/Comment";
// import CreatorInsight from "@/models/CreatorInsight";
// import mongoose from "mongoose";
// import { analyzePerformancePatterns } from "./pattern-analyzer";

// export async function generateCreatorInsights(userId: string) {
//   await connectDB();

//   const userObjectId = new mongoose.Types.ObjectId(userId);

//   // Fetch all videos
//   const videos = await Video.find({ userId: userObjectId });

//   if (videos.length === 0) {
//     throw new Error("No videos found for analysis");
//   }

//   // Fetch all comments
//   const videoIds = videos.map((v) => v._id);
//   const comments = await Comment.find({ videoId: { $in: videoIds } });

//   // Calculate best formats
//   const formatStats = new Map<string, { total: number; engagement: number; count: number }>();

//   videos.forEach((video) => {
//     const format = video.analysis.format || "general";
//     const current = formatStats.get(format) || { total: 0, engagement: 0, count: 0 };
//     formatStats.set(format, {
//       total: current.total + video.engagementRate,
//       engagement: current.engagement + video.engagementRate,
//       count: current.count + 1,
//     });
//   });

//   const bestFormats = Array.from(formatStats.entries())
//     .map(([format, stats]) => ({
//       format,
//       avgEngagement: stats.engagement / stats.count,
//       count: stats.count,
//     }))
//     .sort((a, b) => b.avgEngagement - a.avgEngagement);

//   // Calculate best topics
//   const topicStats = new Map<string, { videos: number; engagement: number }>();

//   videos.forEach((video) => {
//     const topic = video.analysis.topic || "general";
//     const current = topicStats.get(topic) || { videos: 0, engagement: 0 };
//     topicStats.set(topic, {
//       videos: current.videos + 1,
//       engagement: current.engagement + video.engagementRate,
//     });
//   });

//   const bestTopics = Array.from(topicStats.entries())
//     .map(([topic, stats]) => ({
//       topic,
//       videos: stats.videos,
//       avgEngagement: stats.engagement / stats.videos,
//     }))
//     .sort((a, b) => b.avgEngagement - a.avgEngagement);

//   // Calculate best tones
//   const toneStats = new Map<string, { total: number; count: number }>();

//   videos.forEach((video) => {
//     const tone = video.analysis.tone || "general";
//     const current = toneStats.get(tone) || { total: 0, count: 0 };
//     toneStats.set(tone, {
//       total: current.total + video.engagementRate,
//       count: current.count + 1,
//     });
//   });

//   const bestTones = Array.from(toneStats.entries())
//     .map(([tone, stats]) => ({
//       tone,
//       avgEngagement: stats.total / stats.count,
//     }))
//     .sort((a, b) => b.avgEngagement - a.avgEngagement);

//   // Calculate best hooks
//   const hookStats = new Map<string, { total: number; count: number }>();

//   videos.forEach((video) => {
//     const hook = video.analysis.hookType || "general";
//     const current = hookStats.get(hook) || { total: 0, count: 0 };
//     hookStats.set(hook, {
//       total: current.total + video.engagementRate,
//       count: current.count + 1,
//     });
//   });

//   const bestHooks = Array.from(hookStats.entries())
//     .map(([hookType, stats]) => ({
//       hookType,
//       avgEngagement: stats.total / stats.count,
//     }))
//     .sort((a, b) => b.avgEngagement - a.avgEngagement);


//   // Analyze performance patterns
//   // Use pattern analyzer for better upload time analysis
//   const patternAnalysis = await analyzePerformancePatterns(videos);

//   // Extract best upload time
//   const bestUploadTimes = {
//     dayOfWeek: patternAnalysis.uploadTimeOptimization.bestDay,
//     timeOfDay: patternAnalysis.uploadTimeOptimization.bestTime.split(" - ")[0],
//   };

//   // Calculate best upload time (simplified - using most common day)
//   const dayStats = new Map<string, number>();
  
//   videos.forEach((video) => {
//     const day = new Date(video.publishedAt).toLocaleDateString("en-US", {
//       weekday: "long",
//     }).toLowerCase();
//     dayStats.set(day, (dayStats.get(day) || 0) + 1);
//   });

//   const bestDay = Array.from(dayStats.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "thursday";

//   // Analyze audience
//   const intentCounts = new Map<string, number>();
  
//   videos.forEach((video) => {
//     const intent = video.analysis.audienceIntent || "learning";
//     intentCounts.set(intent, (intentCounts.get(intent) || 0) + 1);
//   });

//   const primaryIntent = Array.from(intentCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "learning";

//   // Determine skill level (based on complexity)
//   const complexityCounts = new Map<string, number>();
  
//   videos.forEach((video) => {
//     const complexity = video.analysis.complexity || "intermediate";
//     complexityCounts.set(complexity, (complexityCounts.get(complexity) || 0) + 1);
//   });

//   const skillLevel = Array.from(complexityCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || "intermediate";

//   // Analyze comments for themes
//   const requestThemes = new Map<string, { mentions: number; videoIds: Set<mongoose.Types.ObjectId> }>();
//   const confusionThemes = new Map<string, number>();
//   const praiseThemes = new Map<string, number>();

//   comments.forEach((comment) => {
//     if (comment.intent === "request" || comment.intent === "question") {
//       comment.topics.forEach((topic) => {
//         const current = requestThemes.get(topic) || { mentions: 0, videoIds: new Set() };
//         current.mentions++;
//         current.videoIds.add(comment.videoId);
//         requestThemes.set(topic, current);
//       });
//     }

//     if (comment.intent === "confusion") {
//       comment.topics.forEach((topic) => {
//         confusionThemes.set(topic, (confusionThemes.get(topic) || 0) + 1);
//       });
//     }

//     if (comment.intent === "praise") {
//       comment.topics.forEach((topic) => {
//         praiseThemes.set(topic, (praiseThemes.get(topic) || 0) + 1);
//       });
//     }
//   });

//   const topRequests = Array.from(requestThemes.entries())
//     .map(([theme, data]) => ({
//       theme,
//       mentions: data.mentions,
//       videoIds: Array.from(data.videoIds),
//     }))
//     .sort((a, b) => b.mentions - a.mentions)
//     .slice(0, 10);

//   const confusionAreas = Array.from(confusionThemes.entries())
//     .map(([area, mentions]) => ({ area, mentions }))
//     .sort((a, b) => b.mentions - a.mentions)
//     .slice(0, 5);

//   const praisePatterns = Array.from(praiseThemes.entries())
//     .map(([pattern, mentions]) => ({ pattern, mentions }))
//     .sort((a, b) => b.mentions - a.mentions)
//     .slice(0, 5);

//   // Engagement quality (based on average comment length and likes)
//   const avgCommentLength = comments.reduce((sum, c) => sum + c.text.length, 0) / comments.length;
//   const engagementQuality = avgCommentLength > 100 ? "high" : avgCommentLength > 50 ? "medium" : "low";

//   // Save insights
//   const insights = await CreatorInsight.findOneAndUpdate(
//     { userId: userObjectId },
//     {
//       patterns: {
//         bestFormats: bestFormats.slice(0, 5),
//         bestTopics: bestTopics.slice(0, 10),
//         bestTones: bestTones.slice(0, 5),
//         bestHooks: bestHooks.slice(0, 5),
//         bestUploadTimes: {
//           dayOfWeek: bestDay,
//           timeOfDay: "14:00", // Default to 2 PM
//         },
//       },
//       audience: {
//         primaryIntent,
//         skillLevel,
//         engagementQuality,
//       },
//       commentThemes: {
//         topRequests,
//         confusionAreas,
//         praisePatterns,
//       },
//       lastUpdatedAt: new Date(),
//     },
//     { upsert: true, new: true }
//   );

//   return insights;
// }
import connectDB from "@/lib/db/mongodb";
import Video from "@/models/Video";
import Comment from "@/models/Comment";
import CreatorInsight from "@/models/CreatorInsight";
import mongoose from "mongoose";
import { analyzePerformancePatterns } from "./pattern-analyzer";

/**
 * Generate comprehensive creator insights using pattern analysis
 * This version uses the pattern-analyzer for better format/topic/tone/hook/timing analysis
 */
export async function generateCreatorInsights(userId: string) {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const videos = await Video.find({ userId: userObjectId });
  if (videos.length === 0) {
    throw new Error("No videos found for analysis");
  }

  const videoIds = videos.map((v) => v._id);
  const comments = await Comment.find({ videoId: { $in: videoIds } });

  // ========================================
  // USE PATTERN ANALYZER FOR PERFORMANCE METRICS
  // This replaces the manual calculation and provides better insights
  // ========================================
  const patternAnalysis = await analyzePerformancePatterns(videos);

  // Extract best formats from pattern analysis
  const bestFormats = patternAnalysis.bestFormats.slice(0, 5).map((f) => ({
    format: f.format,
    avgEngagement: f.avgEngagement,
    count: f.videoCount,
  }));

  // Extract best topics from pattern analysis
  const bestTopics = patternAnalysis.bestTopics.slice(0, 10).map((t) => ({
    topic: t.topic,
    videos: t.videoCount,
    avgEngagement: t.avgEngagement,
  }));

  // Extract best tones from pattern analysis
  const bestTones = patternAnalysis.bestTones.slice(0, 5).map((t) => ({
    tone: t.tone,
    avgEngagement: t.avgEngagement,
  }));

  // Extract best hooks from pattern analysis
  const bestHooks = patternAnalysis.bestHooks.slice(0, 5).map((h) => ({
    hookType: h.hookType,
    avgEngagement: h.avgEngagement,
  }));

  // Extract upload time optimization from pattern analysis
  const bestUploadTimes = {
    dayOfWeek: patternAnalysis.uploadTimeOptimization.bestDay,
    // Extract just the start time from "12:00 PM - 6:00 PM"
    timeOfDay: patternAnalysis.uploadTimeOptimization.bestTime.split(" - ")[0],
  };

  // ========================================
  // AUDIENCE ANALYSIS
  // ========================================
  const intentCounts = new Map<string, number>();

  videos.forEach((video) => {
    const intent = video.analysis.audienceIntent || "learning";
    intentCounts.set(intent, (intentCounts.get(intent) || 0) + 1);
  });

  const primaryIntent =
    Array.from(intentCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "learning";

  const complexityCounts = new Map<string, number>();
  videos.forEach((video) => {
    const complexity = video.analysis.complexity || "intermediate";
    complexityCounts.set(
      complexity,
      (complexityCounts.get(complexity) || 0) + 1
    );
  });

  const skillLevel =
    Array.from(complexityCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "intermediate";

  // ========================================
  // COMMENT THEME ANALYSIS
  // ========================================
  const requestThemes = new Map<
    string,
    { mentions: number; videoIds: Set<mongoose.Types.ObjectId> }
  >();
  const confusionThemes = new Map<string, number>();
  const praiseThemes = new Map<string, number>();

  comments.forEach((comment) => {
    if (comment.intent === "request" || comment.intent === "question") {
      comment.topics.forEach((topic) => {
        const current = requestThemes.get(topic) || {
          mentions: 0,
          videoIds: new Set(),
        };
        current.mentions++;
        current.videoIds.add(comment.videoId);
        requestThemes.set(topic, current);
      });
    }

    comments.forEach((comment) => {
      if (comment.intent === "request" || comment.intent === "question") {
        comment.topics.forEach((topic) => {
          const current = requestThemes.get(topic) || {
            mentions: 0,
            videoIds: new Set(),
          };
          current.mentions++;
          current.videoIds.add(comment.videoId);
          requestThemes.set(topic, current);
        });
      }

      if (comment.intent === "confusion") {
        comment.topics.forEach((topic) => {
          confusionThemes.set(topic, (confusionThemes.get(topic) || 0) + 1);
        });
      }

      if (comment.intent === "praise") {
        comment.topics.forEach((topic) => {
          praiseThemes.set(topic, (praiseThemes.get(topic) || 0) + 1);
        });
      }
    });

    topRequests = Array.from(requestThemes.entries())
      .map(([theme, data]) => ({
        theme,
        mentions: data.mentions,
        videoIds: Array.from(data.videoIds),
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);

    confusionAreas = Array.from(confusionThemes.entries())
      .map(([area, mentions]) => ({ area, mentions }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5);

  // Engagement quality (based on average comment length)
  const avgCommentLength =
    comments.length > 0
      ? comments.reduce((sum, c) => sum + c.text.length, 0) / comments.length
      : 0;
  const engagementQuality =
    avgCommentLength > 100 ? "high" : avgCommentLength > 50 ? "medium" : "low";

  // ========================================
  // SAVE TO DATABASE
  // ========================================
  const insights = await CreatorInsight.findOneAndUpdate(
    { userId: userObjectId },
    {
      patterns: {
        bestFormats,
        bestTopics,
        bestTones,
        bestHooks,
        bestUploadTimes,
      },
      audience: {
        primaryIntent,
        skillLevel,
        engagementQuality,
      },
      commentThemes:
        comments.length > 0
          ? {
               topRequests,
               confusionAreas,
               praisePatterns,
            }
          : null,
      lastUpdatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return insights;
}
