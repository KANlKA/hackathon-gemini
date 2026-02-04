import { Queue } from "bullmq";
import Redis from "ioredis";

// Redis connection
const connection = new Redis({
  host: process.env.UPSTASH_REDIS_REST_URL?.replace("https://", "").split(":")[0],
  port: parseInt(process.env.UPSTASH_REDIS_REST_URL?.split(":")[2] || "6379"),
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  maxRetriesPerRequest: null,
});

// Export queue instances
export const weeklyInsightsQueue = new Queue("weekly-insights", { connection });
export const emailQueue = new Queue("email", { connection });
export const syncQueue = new Queue("sync", { connection });

// Helper functions
export async function addWeeklyInsightsJob(userId: string, cronPattern: string, timezone: string) {
  return await weeklyInsightsQueue.add(
    `weekly-insights-${userId}`,
    { userId },
    {
      repeat: {
        pattern: cronPattern,
        tz: timezone,
      },
    }
  );
}

export async function addEmailJob(userId: string, ideaId: string) {
  return await emailQueue.add("send-weekly-email", {
    userId,
    ideaId,
  });
}

export async function addSyncJob(userId: string, channelId: string, accessToken: string) {
  return await syncQueue.add("sync-channel", {
    userId,
    channelId,
    accessToken,
  });
}