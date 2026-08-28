import bcrypt from "bcryptjs";
import Client from "../models/Client.js";

export async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@sterlinglaw.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "Admin123!";

  const existing = await Client.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    console.log(`✅ Admin account ready: ${email}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Client.create({
    clientId: "ADM-2026-001",
    firstName: "Alexander",
    lastName: "Wright",
    clientName: "Alexander Wright",
    email,
    phone: "N/A",
    password: hashedPassword,
    role: "admin",
    status: "Active",
    registeredDate: new Date(),
  });

  console.log(`✅ Default admin created: ${email}`);
}
