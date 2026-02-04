import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import { generateVideoIdeas } from "@/lib/ai/idea-generator";
import { generateCreatorInsights } from "@/lib/ai/insights-generator";
import { sendWeeklyEmail } from "@/lib/email/sender";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import GeneratedIdea from "@/models/GeneratedIdea";

// Redis connection for BullMQ
const connection = new Redis({
  host: process.env.UPSTASH_REDIS_REST_URL?.replace("https://", "").split(":")[0],
  port: parseInt(process.env.UPSTASH_REDIS_REST_URL?.split(":")[2] || "6379"),
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  maxRetriesPerRequest: null,
});

// Create queues
export const weeklyInsightsQueue = new Queue("weekly-insights", { connection });
export const emailQueue = new Queue("email", { connection });

// Weekly Insights Worker
const weeklyInsightsWorker = new Worker(
  "weekly-insights",
  async (job) => {
    const { userId } = job.data;

    console.log(`Processing weekly insights for user ${userId}`);

    try {
      await connectDB();

      // Regenerate insights
      await generateCreatorInsights(userId);

      // Generate new ideas
      const ideas = await generateVideoIdeas(userId);

      // Queue email
      await emailQueue.add("send-weekly-email", {
        userId,
        ideaId: ideas._id.toString(),
      });

      console.log(`Weekly insights completed for user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error(`Error processing weekly insights for user ${userId}:`, error);
      throw error;
    }
  },
  { connection }
);

// Email Worker
const emailWorker = new Worker(
  "email",
  async (job) => {
    const { userId, ideaId } = job.data;

    console.log(`Sending weekly email to user ${userId}`);

    try {
      await connectDB();

      const user = await User.findById(userId);
      const ideas = await GeneratedIdea.findById(ideaId);

      if (!user || !ideas) {
        throw new Error("User or ideas not found");
      }

      await sendWeeklyEmail(user, ideas);

      // Update email status
      await GeneratedIdea.findByIdAndUpdate(ideaId, {
        emailSentAt: new Date(),
        emailStatus: "sent",
      });

      console.log(`Weekly email sent to user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error(`Error sending email to user ${userId}:`, error);

      // Update email status to failed
      if (ideaId) {
        await GeneratedIdea.findByIdAndUpdate(ideaId, {
          emailStatus: "failed",
        });
      }

      throw error;
    }
  },
  { connection }
);

// Schedule weekly insights for all users
export async function scheduleWeeklyInsights() {
  await connectDB();

  const users = await User.find({
    youtubeChannelId: { $exists: true },
    syncStatus: "completed",
  });

  for (const user of users) {
    const { emailDay, emailTime, timezone } = user.settings;

    // Convert day name to cron day number (0 = Sunday, 6 = Saturday)
    const dayMap: { [key: string]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const dayNumber = dayMap[emailDay.toLowerCase()] || 0;
    const [hours, minutes] = emailTime.split(":");

    // Create cron expression: "minute hour * * day"
    const cronExpression = `${minutes} ${hours} * * ${dayNumber}`;

    // Schedule repeatable job
    await weeklyInsightsQueue.add(
      `weekly-insights-${user._id}`,
      { userId: user._id.toString() },
      {
        repeat: {
          pattern: cronExpression,
          tz: timezone,
        },
      }
    );

    console.log(`Scheduled weekly insights for user ${user._id} (${cronExpression} ${timezone})`);
  }
}

// Error handlers
weeklyInsightsWorker.on("failed", (job, err) => {
  console.error(`Weekly insights job ${job?.id} failed:`, err);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

// Success handlers
weeklyInsightsWorker.on("completed", (job) => {
  console.log(`Weekly insights job ${job.id} completed`);
});

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

// Initialize scheduling on startup
if (process.env.NODE_ENV === "production") {
  scheduleWeeklyInsights().then(() => {
    console.log("Weekly insights scheduling initialized");
  });
}

export { weeklyInsightsWorker, emailWorker };