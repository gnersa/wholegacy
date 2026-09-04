import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupExpiredWebchatData,
  ensureWebchatTables,
  webchatSql,
} from "../../../../lib/webchat-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function validRoomId(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z2-9]{8}$/.test(value);
}

function validToken(value: unknown): value is string {
  return typeof value === "string" && value.length >= 32 && value.length <= 128;
}

function safeEqualHex(a: string, b: string) {
  const first = Buffer.from(a, "hex");
  const second = Buffer.from(b, "hex");
  return first.length === second.length && timingSafeEqual(first, second);
}

async function authorize(roomId: string, token: string) {
  const rows = await webchatSql`
    SELECT token_hash, verifier_iv, verifier_ciphertext, expires_at
    FROM webchat_rooms
    WHERE room_id = ${roomId}
      AND expires_at > NOW()
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0] as {
    token_hash: string;
    verifier_iv: string;
    verifier_ciphertext: string;
    expires_at: string;
  };

  if (!safeEqualHex(row.token_hash, tokenHash(token))) return null;
  return row;
}

export async function POST(request: NextRequest) {
  await ensureWebchatTables();
  await cleanupExpiredWebchatData();

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const {
    roomId,
    token,
    verifierIv,
    verifierCiphertext,
  } = body as Record<string, unknown>;

  if (
    !validRoomId(roomId) ||
    !validToken(token) ||
    typeof verifierIv !== "string" ||
    typeof verifierCiphertext !== "string" ||
    verifierIv.length > 256 ||
    verifierCiphertext.length > 4096
  ) {
    return NextResponse.json({ error: "Invalid room data." }, { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

  await webchatSql`
    INSERT INTO webchat_rooms (
      room_id,
      token_hash,
      verifier_iv,
      verifier_ciphertext,
      expires_at
    )
    VALUES (
      ${roomId},
      ${tokenHash(token)},
      ${verifierIv},
      ${verifierCiphertext},
      ${expiresAt.toISOString()}
    )
    ON CONFLICT (room_id)
    DO UPDATE SET
      token_hash = EXCLUDED.token_hash,
      verifier_iv = EXCLUDED.verifier_iv,
      verifier_ciphertext = EXCLUDED.verifier_ciphertext,
      created_at = NOW(),
      expires_at = EXCLUDED.expires_at
  `;

  return NextResponse.json({
    ok: true,
    expiresAt: expiresAt.toISOString(),
  });
}

export async function GET(request: NextRequest) {
  await ensureWebchatTables();

  const roomId = (request.nextUrl.searchParams.get("room") || "").toUpperCase();
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!validRoomId(roomId) || !validToken(token)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const row = await authorize(roomId, token);
  if (!row) {
    return NextResponse.json({ error: "Room unavailable." }, { status: 404 });
  }

  return NextResponse.json(
    {
      verifierIv: row.verifier_iv,
      verifierCiphertext: row.verifier_ciphertext,
      expiresAt: row.expires_at,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function DELETE(request: NextRequest) {
  await ensureWebchatTables();

  const body = await request.json().catch(() => null);
  const roomId = String(body?.roomId || "").toUpperCase();
  const token = String(body?.token || "");

  if (!validRoomId(roomId) || !validToken(token)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const row = await authorize(roomId, token);
  if (!row) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  await webchatSql`
    DELETE FROM webchat_messages
    WHERE room_id = ${roomId}
  `;

  await webchatSql`
    DELETE FROM webchat_rooms
    WHERE room_id = ${roomId}
  `;

  return NextResponse.json({ ok: true });
}
