import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const slug = String(body.slug || "").trim();
    const noteId = String(body.noteId || "").trim();
    const title = String(body.title || "Note 1").trim();
    const content = String(body.content || "");
    const tabOrder = Number(body.tabOrder ?? 0);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required.",
        },
        { status: 400 }
      );
    }

    // Cari workspace berdasarkan slug
    const workspaceResult = await sql`
      SELECT id
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

    const workspaceId = workspaceResult[0].id;

    // Jika noteId ada → update note
    if (noteId) {
      const updated = await sql`
        UPDATE private_notes
        SET
          title = ${title},
          content = ${content},
          tab_order = ${tabOrder},
          updated_at = NOW()
        WHERE id = ${noteId}
          AND workspace_id = ${workspaceId}
        RETURNING
          id,
          title,
          content,
          tab_order,
          created_at,
          updated_at
      `;

      if (updated.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Note not found.",
          },
          { status: 404 }
        );
      }

      await sql`
        UPDATE private_workspaces
        SET updated_at = NOW()
        WHERE id = ${workspaceId}
      `;

      return NextResponse.json({
        success: true,
        action: "updated",
        note: updated[0],
      });
    }

    // Jika noteId kosong → buat note baru
    const created = await sql`
      INSERT INTO private_notes (
        workspace_id,
        title,
        content,
        tab_order
      )
      VALUES (
        ${workspaceId},
        ${title},
        ${content},
        ${tabOrder}
      )
      RETURNING
        id,
        title,
        content,
        tab_order,
        created_at,
        updated_at
    `;

    await sql`
      UPDATE private_workspaces
      SET updated_at = NOW()
      WHERE id = ${workspaceId}
    `;

    return NextResponse.json({
      success: true,
      action: "created",
      note: created[0],
    });
  } catch (error) {
    console.error("SAVE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save note.",
      },
      { status: 500 }
    );
  }
}
