import { NextResponse } from "next/server";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import fs from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/uploads/products");
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images");

    if (!files.length) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 },
      );
    }

    const savedUrls = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);
      savedUrls.push(`/uploads/products/${filename}`);
    }

    return NextResponse.json({ success: true, urls: savedUrls });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "No file url" },
        { status: 400 },
      );
    }

    if (!url.startsWith("/uploads/products/")) {
      return NextResponse.json(
        { success: false, message: "Invalid file path" },
        { status: 400 },
      );
    }

    const filePath = path.join(process.cwd(), "public", url);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
