import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Admin logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("admin_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax",
  });

  response.cookies.delete("admin_session");
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

  return response;
}
