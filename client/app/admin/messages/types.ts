export interface ThreadItem {
  id: string;
  senderName: string;
  senderRole: "client" | "lawyer";
  timestamp: string;
  content: string;
}

export interface InternalNote {
  id: string;
  content: string;
  createdBy: string;
  date: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  practiceArea: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: "Unread" | "Read" | "Replied" | "Archived";
  isConsultationCreated?: boolean;
  thread: ThreadItem[];
  notes: InternalNote[];
  submittedAt?: string;
  createdAt?: string;
}