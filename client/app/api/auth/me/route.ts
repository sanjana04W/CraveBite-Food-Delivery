import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("client_session")?.value;

    if (!session) {
      const res = NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      res.headers.set("Pragma", "no-cache");
      return res;
    }

    let client;
    try {
      client = JSON.parse(session);
    } catch {
      const res = NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return res;
    }

    const res = NextResponse.json({ success: true, client }, { status: 200 });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.headers.set("Pragma", "no-cache");
    return res;
  } catch {
    const res = NextResponse.json(
      { success: false, error: "Invalid session" },
      { status: 401 }
    );
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }
}
