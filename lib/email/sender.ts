import resend from "./resend";
import WeeklyInsightsEmail from "@/emails/WeeklyInsights";
import { IUser } from "@/models/User";
import { IGeneratedIdea } from "@/models/GeneratedIdea";

export async function sendWeeklyEmail(user: IUser, ideas: IGeneratedIdea) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "CreatorMind <noreply@creatormind.com>",
      to: user.email,
      subject: "🎯 Your Top 5 Video Ideas This Week",
      react: WeeklyInsightsEmail({
        userName: user.name || "Creator",
        ideas: ideas.ideas.slice(0, user.settings.ideaCount || 5),
        generatedAt: ideas.generatedAt.toLocaleDateString(),
      }),
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}