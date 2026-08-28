import mongoose, { Document, Schema } from "mongoose";

export interface IAdminSettings extends Document {
  settingsId: string;
  language: string;
  timeZone: string;
  theme: string;
  compactSidebar: boolean;
  twoFactorEnabled: boolean;
  notifications: {
    newContactMessages: boolean;
    newConsultations: boolean;
    upcomingAppointments: boolean;
    appointmentReminders: boolean;
    clientRegistration: boolean;
    articleComments: boolean;
    emailAlerts: boolean;
    browserAlerts: boolean;
  };
}

const AdminSettingsSchema = new Schema<IAdminSettings>(
  {
    settingsId:       { type: String, default: "main", unique: true },
    language:         { type: String, default: "English (US)" },
    timeZone:         { type: String, default: "(GMT+05:30) Colombo, Sri Lanka" },
    theme:            { type: String, default: "Light" },
    compactSidebar:   { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    notifications: {
      newContactMessages:   { type: Boolean, default: true },
      newConsultations:     { type: Boolean, default: true },
      upcomingAppointments: { type: Boolean, default: true },
      appointmentReminders: { type: Boolean, default: true },
      clientRegistration:   { type: Boolean, default: false },
      articleComments:      { type: Boolean, default: true },
      emailAlerts:          { type: Boolean, default: true },
      browserAlerts:        { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminSettings ||
  mongoose.model<IAdminSettings>("AdminSettings", AdminSettingsSchema);
