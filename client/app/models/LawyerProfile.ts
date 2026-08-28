import mongoose, { Document, Schema } from "mongoose";

export interface ILawyerProfile extends Document {
  profileId: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  yearsExperience: number;
  specializations: string[];
  email: string;
  phone: string;
}

const LawyerProfileSchema = new Schema<ILawyerProfile>(
  {
    profileId: { type: String, default: "main", unique: true },
    name:             { type: String, default: "James R. Montgomery" },
    title:            { type: String, default: "Senior Partner" },
    photo:            { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" },
    bio:              { type: String, default: "With over 15 years of dedicated legal practice, committed to protecting clients' rights through strategic advocacy, ethical legal practice, and unwavering confidentiality. Every case receives personalized attention, ensuring each client's unique needs are met with the highest standard of professional care." },
    yearsExperience:  { type: Number, default: 15 },
    specializations:  { type: [String], default: ["Property Law", "Corporate Law", "Civil Litigation"] },
    email:            { type: String, default: "" },
    phone:            { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.LawyerProfile ||
  mongoose.model<ILawyerProfile>("LawyerProfile", LawyerProfileSchema);
