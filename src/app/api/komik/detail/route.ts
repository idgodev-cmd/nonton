import { safeJson, encryptedResponse } from "@/lib/api-utils";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const UPSTREAM_API = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.sansekai.my.id/api") + "/komik";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing 'id' parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(`${UPSTREAM_API}/detail?id=${id}`, {
      next: { revalidate: 60 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://api.sansekai.my.id/",
      }
    });

    if (!response.ok) {
      return encryptedResponse({ success: false, data: null });
    }

    const data = await safeJson(response);
    return encryptedResponse(data);
  } catch (error) {
    console.error("Komik Detail Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
