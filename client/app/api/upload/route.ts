import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File must be under 25MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = originalName.split(".").pop()?.toLowerCase() || "bin";
    const filename = `file-${Date.now()}-${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    // Format human-readable size
    let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
    if (file.size >= 1024 * 1024) {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      originalName: file.name,
      fileType: ext.toUpperCase(),
      size: formattedSize,
      bytes: file.size,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
