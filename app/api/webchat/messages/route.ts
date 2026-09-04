import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  cleanupExpiredWebchatData,
  ensureWebchatTables,
  webchatSql,
} from "@/lib/webchat-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqualHex(a: string, b: string) {
  const first = Buffer.from(a, "hex");
  const second = Buffer.from(b, "hex");
  return first.length === second.length && timingSafeEqual(first, second);
}

function validRoomId(value: unknown) {
  return typeof value === "string" && /^[A-Z2-9]{8}$/.test(value);
}

function validToken(value: unknown) {
  return typeof value === "string" && value.length >= 32 && value.length <= 128;
}

async function authorize(roomId: string, token: string) {
  const rows = await webchatSql`
    SELECT token_hash, expires_at
    FROM webchat_rooms
    WHERE room_id = ${roomId}
      AND expires_at > NOW()
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0] as {
    token_hash: string;
    expires_at: string;
  };

  if (!safeEqualHex(row.token_hash, tokenHash(token))) return null;
  return row;
}

export async function POST(request: NextRequest) {
  await ensureWebchatTables();

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const roomId = String(body.roomId || "").toUpperCase();
  const token = String(body.token || "");
  const senderId = String(body.senderId || "");
  const messageId = String(body.messageId || "");
  const iv = String(body.iv || "");
  const ciphertext = String(body.ciphertext || "");

  if (
    !validRoomId(roomId) ||
    !validToken(token) ||
    senderId.length < 8 ||
    senderId.length > 128 ||
    messageId.length < 8 ||
    messageId.length > 128 ||
    iv.length < 8 ||
    iv.length > 256 ||
    ciphertext.length < 1 ||
    ciphertext.length > 700_000
  ) {
    return NextResponse.json({ error: "Invalid message." }, { status: 400 });
  }

  const room = await authorize(roomId, token);
  if (!room) {
    return NextResponse.json({ error: "Room unavailable." }, { status: 403 });
  }

  await webchatSql`
    INSERT INTO webchat_messages (
      room_id,
      message_id,
      sender_id,
      iv,
      ciphertext,
      expires_at
    )
    VALUES (
      ${roomId},
      ${messageId},
      ${senderId},
      ${iv},
      ${ciphertext},
      ${room.expires_at}
    )
    ON CONFLICT (message_id) DO NOTHING
  `;

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  await ensureWebchatTables();

  const roomId = (request.nextUrl.searchParams.get("room") || "").toUpperCase();
  const token = request.nextUrl.searchParams.get("token") || "";
  const afterRaw = request.nextUrl.searchParams.get("after") || "0";
  const after = Number(afterRaw);

  if (
    !validRoomId(roomId) ||
    !validToken(token) ||
    !Number.isSafeInteger(after) ||
    after < 0
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const room = await authorize(roomId, token);
  if (!room) {
    return NextResponse.json({ error: "Room unavailable." }, { status: 403 });
  }

  const rows = await webchatSql`
    SELECT seq, sender_id, iv, ciphertext
    FROM webchat_messages
    WHERE room_id = ${roomId}
      AND seq > ${after}
      AND expires_at > NOW()
    ORDER BY seq ASC
    LIMIT 200
  `;

  if (Math.random() < 0.02) {
    cleanupExpiredWebchatData().catch(() => undefined);
  }

  return NextResponse.json(
    {
      messages: rows.map((row: any) => ({
        seq: Number(row.seq),
        senderId: row.sender_id,
        iv: row.iv,
        ciphertext: row.ciphertext,
      })),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
