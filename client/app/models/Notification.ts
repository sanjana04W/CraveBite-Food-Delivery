import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  type: "Consultation" | "Appointment" | "Client" | "Message" | "Document" | "Case" | "System";
  title: string;
  description: string;
  link: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type:        { type: String, enum: ["Consultation", "Appointment", "Client", "Message", "Document", "Case", "System"], required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    link:        { type: String, default: "/admin" },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
