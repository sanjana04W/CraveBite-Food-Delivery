import mongoose, { Document, Schema } from "mongoose";

export interface IThreadItem {
  id: string;
  senderName: string;
  senderRole: "client" | "lawyer";
  timestamp: string;
  content: string;
}

export interface IInternalNote {
  id: string;
  content: string;
  createdBy: string;
  date: string;
}

export interface IContactMessage extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  practiceArea: string;
  message: string;
  status: "Unread" | "Read" | "Replied" | "Archived";
  thread: IThreadItem[];
  notes: IInternalNote[];
  submittedAt: Date;
}

const ThreadItemSchema = new Schema(
  { id: String, senderName: String, senderRole: { type: String, enum: ["client", "lawyer"] }, timestamp: String, content: String },
  { _id: false }
);

const InternalNoteSchema = new Schema(
  { id: String, content: String, createdBy: String, date: String },
  { _id: false }
);

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true },
    phone:        { type: String, default: "" },
    subject:      { type: String, default: "General Inquiry" },
    practiceArea: { type: String, default: "" },
    message:      { type: String, required: true },
    status:       { type: String, enum: ["Unread", "Read", "Replied", "Archived"], default: "Unread" },
    thread:       { type: [ThreadItemSchema], default: [] },
    notes:        { type: [InternalNoteSchema], default: [] },
    submittedAt:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>("ContactMessage", ContactMessageSchema);
