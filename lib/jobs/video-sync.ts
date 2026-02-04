import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Video from "@/models/Video";
import { fetchAllVideos } from "@/lib/youtube/fetcher";

export async function checkNewVideos(userId: string, channelId: string, accessToken: string) {
  try {
    await connectDB();

    // Get latest video from DB
    const latestVideo = await Video.findOne({ userId })
      .sort({ publishedAt: -1 })
      .select("publishedAt");

    if (!latestVideo) {
      console.log("No existing videos, skipping incremental sync");
      return { newVideos: 0 };
    }

    // Fetch recent videos from YouTube
    const videos = await fetchAllVideos(channelId, accessToken);

    // Filter for new videos
    const newVideos = videos.filter(
      (v) => new Date(v.publishedAt) > latestVideo.publishedAt
    );

    console.log(`Found ${newVideos.length} new videos for user ${userId}`);

    // TODO: Process new videos (similar to full sync)

    return { newVideos: newVideos.length };
  } catch (error) {
    console.error("Error checking new videos:", error);
    throw error;
  }
}