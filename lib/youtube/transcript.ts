import { YoutubeTranscript } from "youtube-transcript";

export async function getTranscript(videoId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Combine all transcript segments into a single string
    const fullTranscript = transcript
      .map((segment) => segment.text)
      .join(" ");
    
    return fullTranscript;
  } catch (error) {
    console.error(`Error fetching transcript for video ${videoId}:`, error);
    return ""; // Return empty string if transcript not available
  }
}