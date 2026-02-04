import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { generateCreatorInsights } from "@/lib/ai/insights-generator";
import { generateVideoIdeas } from "@/lib/ai/idea-generator";
import { addEmailJob } from "../jobs/queue";

export async function processWeeklyInsights(userId: string) {
  try {
    await connectDB();

    console.log(`Processing weekly insights for user ${userId}`);

    // Regenerate insights
    await generateCreatorInsights(userId);

    // Generate new ideas
    const ideas = await generateVideoIdeas(userId);

    // Queue email
    await addEmailJob(userId, ideas._id.toString());

    console.log(`Weekly insights completed for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error processing weekly insights for user ${userId}:`, error);
    throw error;
  }
}