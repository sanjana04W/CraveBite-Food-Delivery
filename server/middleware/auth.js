import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, error: "Admin access required" });
  }
  next();
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      clientId: user.clientId,
      email: user.email,
      role: user.role || "user",
      name: user.clientName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function publicUser(user) {
  return {
    id: user._id.toString(),
    clientId: user.clientId,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.clientName,
    email: user.email,
    phone: user.phone,
    role: user.role || "user",
    status: user.status,
    registeredDate: user.registeredDate,
    lastLogin: user.lastLogin || null,
    consultations: user.consultations || 0,
    appointments: user.appointments || 0,
  };
}
