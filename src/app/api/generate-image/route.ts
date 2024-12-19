import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Prompt text cannot be empty" },
        { status: 400 }
      );
    }

    // Call your backend API
    const backendUrl = `https://dawitzewdu2123--pentagram-model-model-generate-dev.modal.run/?prompt=${encodeURIComponent(
      text
    )}`;

    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error("Failed to generate the image from the backend.");
    }

    // Get the binary image data
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Create a data URL for the image
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
