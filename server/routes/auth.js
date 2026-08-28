import express from "express";
import bcrypt from "bcryptjs";
import Client from "../models/Client.js";
import { protect, signToken, publicUser } from "../middleware/auth.js";

const router = express.Router();

async function nextClientId() {
  const count = await Client.countDocuments({ role: { $ne: "admin" } });
  return `CL-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
}

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide first name, last name, email, and password",
      });
    }

    const existing = await Client.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const clientId = await nextClientId();

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
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const client = await Client.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );

    if (!client) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    client.lastLogin = new Date();
    await client.save();

    const token = signToken(client);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      client: publicUser(client),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const client = await Client.findById(req.user.id);
    if (!client) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    return res.status(200).json({
      success: true,
      client: publicUser(client),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

router.post("/logout", (_req, res) => {
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
