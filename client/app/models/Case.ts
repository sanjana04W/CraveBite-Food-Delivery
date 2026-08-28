import mongoose, { Document, Schema } from "mongoose";

export interface ICaseNote {
  id: string;
  note: string;
  createdBy: string;
  date: string;
}

export interface ICase extends Document {
  caseId: string;
  title: string;
  clientName: string;
  clientId?: string;
  clientEmail: string;
  clientPhone: string;
  practiceArea: string;
  status: "Pending" | "Active" | "On Hold" | "Completed" | "Closed";
  priority: "Low" | "Medium" | "High";
  courtInstitution: string;
  caseReferenceNumber: string;
  openedDate: Date;
  lastUpdated: Date;
  description: string;
  notes: ICaseNote[];
}

const CaseNoteSchema = new Schema<ICaseNote>(
  {
    id: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: String, default: "Attorney-at-Law" },
    date: { type: String, required: true },
  },
  { _id: false }
);

const CaseSchema = new Schema<ICase>(
  {
    caseId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    clientName: { type: String, required: true },
    clientId: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    clientPhone: { type: String, default: "" },
    practiceArea: { type: String, default: "General Practice" },
    status: {
      type: String,
      enum: ["Pending", "Active", "On Hold", "Completed", "Closed"],
      default: "Active",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    courtInstitution: { type: String, default: "" },
    caseReferenceNumber: { type: String, default: "" },
    openedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    description: { type: String, default: "" },
    notes: { type: [CaseNoteSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);
