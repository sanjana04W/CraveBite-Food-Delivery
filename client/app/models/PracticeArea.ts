import mongoose, { Document, Schema } from "mongoose";

export interface IPracticeArea extends Document {
  slug: string;
  title: string;
  category: string;
  iconName: string;
  description: string;
  subtitle: string;
  heroImage: string;
  image?: string;
  price?: number;
  prepTime?: string;
  calories?: number;
  isVeg?: boolean;
  rating?: number;
  reviewsCount?: number;
  isChefSpecial?: boolean;
  customizations?: any[];
  overviewDescription: string;
  services: { icon: string; title: string; description: string }[];
  commonMatters: string[];
  faqs: { question: string; answer: string }[];
  status: "Published" | "Draft" | "Archived";
  visibility: boolean;
  order: number;
  views: number;
}

const PracticeAreaSchema = new Schema<IPracticeArea>(
  {
    slug:               { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:              { type: String, required: true },
    category:           { type: String, default: "Artisan Pizzas" },
    iconName:           { type: String, default: "Flame" },
    description:        { type: String, default: "" },
    subtitle:           { type: String, default: "" },
    heroImage:          { type: String, default: "" },
    image:              { type: String, default: "" },
    price:              { type: Number, default: 15.99 },
    prepTime:           { type: String, default: "20 min" },
    calories:           { type: Number, default: 550 },
    isVeg:              { type: Boolean, default: true },
    rating:             { type: Number, default: 4.9 },
    reviewsCount:       { type: Number, default: 120 },
    isChefSpecial:      { type: Boolean, default: false },
    customizations:     { type: Schema.Types.Mixed, default: [] },
    overviewDescription:{ type: String, default: "" },
    services:           [{ icon: String, title: String, description: String }],
    commonMatters:      [String],
    faqs:               [{ question: String, answer: String }],
    status:             { type: String, enum: ["Published", "Draft", "Archived"], default: "Published" },
    visibility:         { type: Boolean, default: true },
    order:              { type: Number, default: 0 },
    views:              { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.PracticeArea ||
  mongoose.model<IPracticeArea>("PracticeArea", PracticeAreaSchema);
