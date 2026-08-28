import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/backend";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const res = await backendFetch(`/api/clients/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Could not reach the backend server" },
      { status: 502 }
    );
  }
}
