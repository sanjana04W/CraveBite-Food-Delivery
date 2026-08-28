import mongoose, { Schema, Document, models } from "mongoose";

export interface IConsultation extends Document {
  requestId: string;
  fullName: string;
  email: string;
  phone: string;
  practiceArea: string;
  description: string;
  consent: boolean;
  status: "New" | "Viewed" | "Contacted";
  submittedDate: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    practiceArea: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    consent: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["New", "Viewed", "Contacted"],
      default: "New",
    },

    submittedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Consultation =
  models.Consultation ||
  mongoose.model<IConsultation>("Consultation", ConsultationSchema);

export default Consultation;