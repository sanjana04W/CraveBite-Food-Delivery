import mongoose, { Document, Schema } from "mongoose";

export interface IAppointmentNote {
  id: string;
  content: string;
  author: string;
  date: string;
}

export interface ITimelineEntry {
  date: string;
  action: string;
}

export interface IAppointment extends Document {
  appointmentId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  dateISO: Date;
  time: string;
  duration: "30 Minutes" | "45 Minutes" | "60 Minutes";
  consultationType: "Online" | "In Person" | "Phone";
  status: "Upcoming" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled" | "No Show";
  locationOrLink: string;
  originalProblem: string;
  privateNotes: IAppointmentNote[];
  timeline: ITimelineEntry[];
}

const NoteSchema = new Schema(
  { id: String, content: String, author: String, date: String },
  { _id: false }
);

const TimelineSchema = new Schema(
  { date: String, action: String },
  { _id: false }
);

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId:   { type: String, required: true, unique: true },
    clientName:      { type: String, required: true },
    clientEmail:     { type: String, required: true },
    clientPhone:     { type: String, default: "" },
    dateISO:         { type: Date, required: true },
    time:            { type: String, required: true },
    duration:        { type: String, enum: ["30 Minutes", "45 Minutes", "60 Minutes"], default: "30 Minutes" },
    consultationType:{ type: String, enum: ["Online", "In Person", "Phone"], default: "Online" },
    status:          { type: String, enum: ["Upcoming", "Confirmed", "Completed", "Cancelled", "Rescheduled", "No Show"], default: "Upcoming" },
    locationOrLink:  { type: String, default: "" },
    originalProblem: { type: String, default: "" },
    privateNotes:    { type: [NoteSchema], default: [] },
    timeline:        { type: [TimelineSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
