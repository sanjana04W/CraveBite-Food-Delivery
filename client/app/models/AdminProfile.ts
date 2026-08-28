import mongoose, { Document, Schema } from "mongoose";

export interface IAdminProfile extends Document {
  profileId: string;
  firstName: string;
  lastName: string;
  phone: string;
  title: string;
  address: string;
  experience: string;
  licenseNumber: string;
  bio: string;
  practiceAreas: string[];
  profilePhoto: string;
}

const AdminProfileSchema = new Schema<IAdminProfile>(
  {
    profileId:     { type: String, default: "main", unique: true },
    firstName:     { type: String, default: "Admin" },
    lastName:      { type: String, default: "" },
    phone:         { type: String, default: "" },
    title:         { type: String, default: "Attorney-at-Law" },
    address:       { type: String, default: "" },
    experience:    { type: String, default: "" },
    licenseNumber: { type: String, default: "" },
    bio:           { type: String, default: "" },
    practiceAreas: { type: [String], default: [] },
    profilePhoto:  { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.AdminProfile ||
  mongoose.model<IAdminProfile>("AdminProfile", AdminProfileSchema);
