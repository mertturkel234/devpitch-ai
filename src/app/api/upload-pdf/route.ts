import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Dynamically require pdf-parse inside the handler to prevent Next.js build errors 
    // related to DOMMatrix and canvas when statically evaluating the file
    const pdfParse = require("pdf-parse");
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "PDF dosyası bulunamadı." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);

    return NextResponse.json({
      text: pdfData.text,
      success: true,
    });
  } catch (error: any) {
    console.error("PDF upload error:", error);
    return NextResponse.json(
      { error: "PDF okunurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
