import mongoose, { Schema, Document, models } from "mongoose";

export interface IClient extends Document {
  clientId: string;
  firstName: string;
  lastName: string;
  clientName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  password: string;
  registeredDate: Date;
  consultations: number;
  appointments: number;
  status: "Active" | "Inactive";
  role: "user" | "admin";
}

const ClientSchema = new Schema<IClient>(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    clientName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    registeredDate: {
      type: Date,
      default: Date.now,
    },

    consultations: {
      type: Number,
      default: 0,
    },

    appointments: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Client =
  models.Client || mongoose.model<IClient>("Client", ClientSchema);

export default Client;