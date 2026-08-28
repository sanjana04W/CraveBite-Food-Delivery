import mongoose, { Document, Schema } from "mongoose";

export interface ILegalDocument extends Document {
  docId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  size: string;
  bytes: number;
  uploadedDate: Date;
  status: "Uploaded" | "Under Review" | "Approved" | "Archived";
  documentType: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientId?: string;
  caseId?: string;
  caseTitle?: string;
  practiceArea?: string;
  caseStatus?: string;
  notes?: string;
}

const LegalDocumentSchema = new Schema<ILegalDocument>(
  {
    docId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: "PDF" },
    size: { type: String, default: "0 KB" },
    bytes: { type: Number, default: 0 },
    uploadedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Uploaded", "Under Review", "Approved", "Archived"],
      default: "Uploaded",
    },
    documentType: {
      type: String,
      default: "Legal Agreement",
    },
    clientName: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    clientPhone: { type: String, default: "" },
    clientId: { type: String, default: "" },
    caseId: { type: String, default: "" },
    caseTitle: { type: String, default: "" },
    practiceArea: { type: String, default: "" },
    caseStatus: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.LegalDocument ||
  mongoose.model<ILegalDocument>("LegalDocument", LegalDocumentSchema);
