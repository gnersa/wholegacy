import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = String(body.slug || "")
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .toLowerCase();

    if (!slug) {
      return NextResponse.json(
        {
          available: false,
          message: "Please enter a name.",
        },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          available: false,
          message: "Use only letters, numbers, and hyphens.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id
      FROM private_workspaces
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (result.length > 0) {
      return NextResponse.json({
        available: false,
        message:
          "This name is already taken. Please use a different name.",
      });
    }

    await sql`
      INSERT INTO private_workspaces (slug)
      VALUES (${slug})
    `;

    return NextResponse.json({
      available: true,
      slug,
    });
  } catch (error) {
    console.error("Private Note error:", error);

    return NextResponse.json(
      {
        available: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
