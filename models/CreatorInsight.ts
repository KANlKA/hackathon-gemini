import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICreatorInsight extends Document {
  userId: mongoose.Types.ObjectId;
  
  patterns: {
    bestFormats: Array<{ format: string; avgEngagement: number; count: number }>;
    bestTopics: Array<{ topic: string; videos: number; avgEngagement: number }>;
    bestTones: Array<{ tone: string; avgEngagement: number }>;
    bestHooks: Array<{ hookType: string; avgEngagement: number }>;
    bestUploadTimes: {
      dayOfWeek: string;
      timeOfDay: string;
    };
  };
  
  audience: {
    primaryIntent: string;
    skillLevel: string;
    demographics?: string;
    engagementQuality: string;
  };
  
  commentThemes: {
    topRequests: Array<{ theme: string; mentions: number; videoIds: mongoose.Types.ObjectId[] }>;
    confusionAreas: Array<{ area: string; mentions: number }>;
    praisePatterns: Array<{ pattern: string; mentions: number }>;
  };
  
  lastUpdatedAt: Date;
}

const CreatorInsightSchema = new Schema<ICreatorInsight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    patterns: {
      bestFormats: [{
        format: String,
        avgEngagement: Number,
        count: Number,
      }],
      bestTopics: [{
        topic: String,
        videos: Number,
        avgEngagement: Number,
      }],
      bestTones: [{
        tone: String,
        avgEngagement: Number,
      }],
      bestHooks: [{
        hookType: String,
        avgEngagement: Number,
      }],
      bestUploadTimes: {
        dayOfWeek: String,
        timeOfDay: String,
      },
    },
    
    audience: {
      primaryIntent: String,
      skillLevel: String,
      demographics: String,
      engagementQuality: String,
    },
    
    commentThemes: {
      topRequests: [{
        theme: String,
        mentions: Number,
        videoIds: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
      }],
      confusionAreas: [{
        area: String,
        mentions: Number,
      }],
      praisePatterns: [{
        pattern: String,
        mentions: Number,
      }],
    },
    
    lastUpdatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Indexes
CreatorInsightSchema.index({ userId: 1 });

const CreatorInsight: Model<ICreatorInsight> =
  mongoose.models.CreatorInsight || mongoose.model<ICreatorInsight>('CreatorInsight', CreatorInsightSchema);

export default CreatorInsight;