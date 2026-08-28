import fs from "fs";
import path from "path";

export interface AdminCredentials {
  email: string;
  passwordHash?: string;
  plainPassword?: string;
  firstName: string;
  lastName: string;
  title: string;
  phone: string;
}

const DEFAULT_ADMIN: AdminCredentials = {
  email: "admin@cravebite.com",
  plainPassword: "admin123",
  firstName: "Chef",
  lastName: "Executive",
  title: "Restaurant Executive",
  phone: "+1 (555) 019-2834",
};

// Global in-memory cache
let inMemoryAdmin: AdminCredentials = { ...DEFAULT_ADMIN };

const STORE_PATH = path.join(process.cwd(), ".admin_auth.json");

export function getAdminCredentials(): AdminCredentials {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      inMemoryAdmin = { ...DEFAULT_ADMIN, ...parsed };
      return inMemoryAdmin;
    }
  } catch (_) {}
  return inMemoryAdmin;
}

export function updateAdminCredentials(updates: Partial<AdminCredentials>): AdminCredentials {
  inMemoryAdmin = { ...inMemoryAdmin, ...updates };
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(inMemoryAdmin, null, 2), "utf-8");
  } catch (_) {}
  return inMemoryAdmin;
}
