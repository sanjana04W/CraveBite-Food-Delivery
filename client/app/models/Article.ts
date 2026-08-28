import mongoose, { Document, Schema } from "mongoose";

export interface IArticle extends Document {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  excerpt: string;
  heroImage: string;
  summary: string;
  content: { heading: string; paragraphs: string[] }[];
  featured: boolean;
  status: "Published" | "Draft" | "Archived";
  views: number;
}

const ArticleSchema = new Schema<IArticle>(
  {
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:       { type: String, required: true },
    category:    { type: String, default: "" },
    author:      { type: String, default: "Attorney-at-Law" },
    date:        { type: String, default: "" },
    readingTime: { type: String, default: "" },
    excerpt:     { type: String, default: "" },
    heroImage:   { type: String, default: "" },
    summary:     { type: String, default: "" },
    content:     [{ heading: String, paragraphs: [String] }],
    featured:    { type: Boolean, default: false },
    status:      { type: String, enum: ["Published", "Draft", "Archived"], default: "Published" },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);
