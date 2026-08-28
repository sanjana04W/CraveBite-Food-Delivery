import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  status: "Approved" | "Pending" | "Rejected";
  featured: boolean;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, default: "Client" },
    avatar:   { type: String, default: "" },
    quote:    { type: String, required: true, trim: true },
    rating:   { type: Number, min: 1, max: 5, default: 5 },
    status:   { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Approved" },
    featured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
