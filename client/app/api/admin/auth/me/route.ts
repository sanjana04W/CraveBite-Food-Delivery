import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      const res = NextResponse.json(
        { success: false, error: "Not authenticated as admin" },
        { status: 401 }
      );
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    let admin;
    try {
      admin = JSON.parse(session);
    } catch {
      const res = NextResponse.json(
        { success: false, error: "Invalid admin session" },
        { status: 401 }
      );
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    const res = NextResponse.json({ success: true, admin }, { status: 200 });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch {
    const res = NextResponse.json(
      { success: false, error: "Invalid admin session" },
      { status: 401 }
    );
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }
}
