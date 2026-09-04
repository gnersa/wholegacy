import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured.");
}

export const webchatSql = neon(process.env.DATABASE_URL);

let initialized = false;

export async function ensureWebchatTables() {
  if (initialized) return;

  await webchatSql`
    CREATE TABLE IF NOT EXISTS webchat_rooms (
      room_id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL,
      verifier_iv TEXT NOT NULL,
      verifier_ciphertext TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;

  await webchatSql`
    CREATE TABLE IF NOT EXISTS webchat_messages (
      seq BIGSERIAL PRIMARY KEY,
      room_id TEXT NOT NULL,
      message_id TEXT NOT NULL UNIQUE,
      sender_id TEXT NOT NULL,
      iv TEXT NOT NULL,
      ciphertext TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;

  await webchatSql`
    CREATE INDEX IF NOT EXISTS webchat_messages_room_seq_idx
    ON webchat_messages (room_id, seq)
  `;

  initialized = true;
}

export async function cleanupExpiredWebchatData() {
  await ensureWebchatTables();

  await webchatSql`
    DELETE FROM webchat_messages
    WHERE expires_at <= NOW()
  `;

  await webchatSql`
    DELETE FROM webchat_rooms
    WHERE expires_at <= NOW()
  `;
}
