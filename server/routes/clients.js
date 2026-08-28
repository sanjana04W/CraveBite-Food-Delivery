import express from "express";
import bcrypt from "bcryptjs";
import Client from "../models/Client.js";
import { protect, adminOnly, signToken, publicUser } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, adminOnly, async (_req, res) => {
  try {
    const clients = await Client.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }

    return res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide first name, last name, email, and password",
      });
    }

    const existingClient = await Client.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingClient) {
      return res.status(409).json({
        success: false,
        error: "Email is already registered.",
      });
    }

    const count = await Client.countDocuments({ role: { $ne: "admin" } });
    const clientId = `CL-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await Client.create({
      clientId,
      firstName,
      lastName,
      clientName: `${firstName} ${lastName}`,
      email,
      phone: phone || "N/A",
      password: hashedPassword,
      role: "user",
      registeredDate: new Date(),
      consultations: 0,
      appointments: 0,
      status: "Active",
    });

    const token = signToken(newClient);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      client: publicUser(newClient),
      data: {
        clientId: newClient.clientId,
        name: newClient.clientName,
        email: newClient.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
