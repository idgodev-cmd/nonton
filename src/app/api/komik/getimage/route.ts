import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const UPSTREAM_API = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api") + "/komik";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' parameter" },
        { status: 400 }
      );
    }

    // Use wsrv.nl to fetch and process the image, bypassing our upstream quota for images
    const imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=jpg`;
    
    const response = await fetch(imageUrl, {
      next: { revalidate: 31536000 }, // Cache long-term
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Komik GetImage Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
