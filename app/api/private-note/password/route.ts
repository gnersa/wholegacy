import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = String(body.slug || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!slug || !password) {
      return NextResponse.json(
        {
          message: "Slug and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT id, password_hash
      FROM private_workspaces
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          message: "Private Note not found.",
        },
        { status: 404 }
      );
    }

    if (result[0].password_hash) {
      return NextResponse.json(
        {
          message: "Password has already been created.",
        },
        { status: 409 }
      );
    }

    await sql`
      UPDATE private_workspaces
      SET
        password_hash = ${password},
        updated_at = NOW()
      WHERE slug = ${slug}
    `;

    return NextResponse.json({
      success: true,
      message: "Password created successfully.",
    });
  } catch (error) {
    console.error("Password error:", error);

    return NextResponse.json(
      {
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
