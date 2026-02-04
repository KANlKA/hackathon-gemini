import { Types } from "mongoose";

export interface IUserSettings {
  emailFrequency: "weekly" | "biweekly" | "monthly";
  emailDay: string;
  emailTime: string;
  timezone: string;
  ideaCount: number;
  preferences?: {
    focusAreas?: string[];
    avoidTopics?: string[];
    preferredFormats?: string[];
  };
}

export interface ICreatorPattern {
  bestFormats: Array<{ format: string; avgEngagement: number; count: number }>;
  bestTopics: Array<{ topic: string; videos: number; avgEngagement: number }>;
  bestTones: Array<{ tone: string; avgEngagement: number }>;
  bestHooks: Array<{ hookType: string; avgEngagement: number }>;
  bestUploadTimes: {
    dayOfWeek: string;
    timeOfDay: string;
  };
}

export interface IAudienceProfile {
  primaryIntent: string;
  skillLevel: string;
  demographics?: string;
  engagementQuality: string;
}

export interface ICommentThemes {
  topRequests: Array<{
    theme: string;
    mentions: number;
    videoIds: Types.ObjectId[];
  }>;
  confusionAreas: Array<{ area: string; mentions: number }>;
  praisePatterns: Array<{ pattern: string; mentions: number }>;
}