import mongoose from "mongoose";

const ContactInquirySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["ai_response", "manual_review"],
      default: "ai_response",
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "forwarded"],
      default: "pending",
    },
    mailjetMessageId: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying by user and date
ContactInquirySchema.index({ userId: 1, createdAt: -1 });

// Index for querying by status
ContactInquirySchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", ContactInquirySchema);