import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = String(body.slug || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!slug || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id, slug, password_hash
      FROM private_workspaces
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Private Note not found.",
        },
        { status: 404 }
      );
    }

    const workspace = result[0];

    if (!workspace.password_hash) {
      return NextResponse.json(
        {
          success: false,
          message: "This Private Note has no password yet.",
        },
        { status: 400 }
      );
    }

    if (password !== workspace.password_hash) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password correct.",
      slug: workspace.slug,
    });
  } catch (error) {
    console.error("Private Note login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
