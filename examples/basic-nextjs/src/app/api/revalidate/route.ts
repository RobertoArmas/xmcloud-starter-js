import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function OPTIONS() {
  return NextResponse.json(
    { message: "OK" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-revalidate-token",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  // Allow cors
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-revalidate-token",
  };
  try {
    const { tags } = (await req.json()) as { tags?: string[] };
    const revalidateTagToken = req.headers.get("x-revalidate-token");

    if (
      !revalidateTagToken ||
      process.env.SITECORE_REVALIDATE_TOKEN !== revalidateTagToken
    ) {
      //debug.revalidate("Invalid revalidate tag token.");
      return NextResponse.json(
        { error: "Invalid tag. Expected non-empty string." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      //debug.revalidate("Invalid tag. Expected non-empty string.");
      return NextResponse.json(
        { error: "Invalid tag. Expected non-empty string." },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedTags = tags.map((tag) => tag.trim());

    for (const tag of normalizedTags) {
      revalidateTag(tag, "max");
    }
    //debug.info("Revalidated tag: %s", normalizedTag);

    return NextResponse.json(
      {
        ok: true,
        revalidated: true,
        tags: normalizedTags,
      },
      { headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400, headers: corsHeaders }
    );
  }
}
