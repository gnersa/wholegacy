import { NextRequest, NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const slug = String(body.slug || "")
      .trim()
      .toLowerCase();

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required.",
        },
        { status: 400 }
      );
    }

    /*
     * CHECK LOGIN COOKIE
     */
    const cookieName = `wholegacy_private_${slug}`;
    const authCookie = request.cookies.get(cookieName);

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    /*
     * FIND WORKSPACE
     */
    const workspaceResult = await sql`
      SELECT
        id,
        slug,
        created_at,
        updated_at
      FROM private_workspaces
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (workspaceResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Workspace not found.",
        },
        { status: 404 }
      );
    }

    const workspace = workspaceResult[0];

    /*
     * GET NOTES
     */
    const notes = await sql`
      SELECT
        id,
        title,
        content,
        tab_order,
        created_at,
        updated_at
      FROM private_notes
      WHERE workspace_id = ${workspace.id}
      ORDER BY tab_order ASC, created_at ASC
    `;

    return NextResponse.json({
      success: true,
      workspace,
      notes,
    });
  } catch (error) {
    console.error("RELOAD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reload workspace.",
      },
      { status: 500 }
    );
  }
}
