import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  status: "Active" | "Unsubscribed";
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Unsubscribed"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber ||
  mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
