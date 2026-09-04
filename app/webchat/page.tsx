 "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DataConnection } from "peerjs";

type ChatMessage = {
  id: string;
  sender: "me" | "peer" | "system";
  text: string;
  time: string;
};

type PeerLike = {
  destroy: () => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  connect: (peerId: string, options?: Record<string, unknown>) => DataConnection;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomString(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function WebChatPage() {
  const [mode, setMode] = useState<"choose" | "host" | "join">("choose");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [hostPeerId, setHostPeerId] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const peerRef = useRef<PeerLike | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);
  const passwordRef = useRef("");
  const isHostRef = useRef(false);

  const query = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);

  useEffect(() => {
    const room = query?.get("room") || "";
    const peer = query?.get("peer") || "";
    if (room && peer) {
      setJoinRoom(room.toUpperCase());
      setHostPeerId(peer);
      setMode("join");
    }
  }, [query]);

  const addSystem = useCallback((text: string) => {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), sender: "system", text, time: now() },
    ]);
  }, []);

  const attachConnection = useCallback(
    (connection: DataConnection, host: boolean) => {
      connectionRef.current = connection;

      connection.on("open", () => {
        if (!host) {
          connection.send({
            type: "auth",
            room: joinRoom.toUpperCase(),
            password: joinPassword,
          });
          addSystem("Connected. Authenticating room access…");
        } else {
          addSystem("Peer connected. Waiting for room authentication…");
        }
      });

      connection.on("data", (raw) => {
        const data = raw as any;

        if (host && data?.type === "auth") {
          const valid =
            data.room === roomId &&
            data.password === passwordRef.current;

          if (valid) {
            connection.send({ type: "auth-ok" });
            setConnected(true);
            addSystem("The other person joined the private room.");
          } else {
            connection.send({ type: "auth-failed" });
            addSystem("A connection attempt was rejected.");
            setTimeout(() => connection.close(), 150);
          }
          return;
        }

        if (!host && data?.type === "auth-ok") {
          setConnected(true);
          addSystem("Room access verified. You can now chat.");
          return;
        }

        if (!host && data?.type === "auth-failed") {
          setConnecting(false);
          addSystem("Incorrect password or room details.");
          connection.close();
          return;
        }

        if (data?.type === "chat" && typeof data.text === "string") {
          setMessages((current) => [
            ...current,
            {
              id: data.id || crypto.randomUUID(),
              sender: "peer",
              text: data.text,
              time: data.time || now(),
            },
          ]);
        }
      });

      connection.on("close", () => {
        connectionRef.current = null;
        setConnected(false);
        setConnecting(false);
        addSystem("The peer disconnected.");
      });

      connection.on("error", () => {
        setConnecting(false);
        setConnected(false);
        addSystem("The peer-to-peer connection encountered an error.");
      });
    },
    [addSystem, joinPassword, joinRoom, passwordRef, roomId]
  );

  const loadPeer = useCallback(async () => {
    if (peerRef.current) return peerRef.current;
    const module = await import("peerjs");
    const PeerCtor = module.default;
    const peer = new PeerCtor() as unknown as PeerLike;
    peerRef.current = peer;
    return peer;
  }, []);

  const createRoom = async () => {
    setConnecting(true);
    const newRoom = randomString(8);
    const newPassword = randomString(10);
    passwordRef.current = newPassword;
    isHostRef.current = true;
    setRoomId(newRoom);
    setPassword(newPassword);
    setMessages([]);
    setMode("host");

    try {
      const peer = await loadPeer();
      peer.on("open", (id: string) => {
        setHostPeerId(id);
        setConnecting(false);
        addSystem("Private room created. Share the link and password.");
      });
      peer.on("connection", (connection: DataConnection) => {
        attachConnection(connection, true);
      });
      peer.on("error", () => {
        setConnecting(false);
        addSystem("Unable to initialize the P2P room. Please try again.");
      });
    } catch {
      setConnecting(false);
      addSystem("Peer-to-peer service could not be loaded.");
    }
  };

  const join = async () => {
    if (!joinRoom.trim() || !joinPassword.trim() || !hostPeerId) return;

    setConnecting(true);
    passwordRef.current = joinPassword.trim();

    try {
      const peer = await loadPeer();
      peer.on("error", () => {
        setConnecting(false);
        setConnected(false);
        addSystem("Could not reach the room. Check the link and try again.");
      });

      const connection = peer.connect(hostPeerId, { reliable: true });
      attachConnection(connection, false);
    } catch {
      setConnecting(false);
      addSystem("Peer-to-peer service could not be loaded.");
    }
  };

  const shareUrl =
    typeof window !== "undefined" && hostPeerId
      ? `${window.location.origin}/webchat?room=${encodeURIComponent(
          roomId
        )}&peer=${encodeURIComponent(hostPeerId)}`
      : "";

  const copyInvite = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const sendMessage = () => {
    const text = draft.trim();
    const connection = connectionRef.current;
    if (!text || !connection || !connected) return;

    const message = {
      type: "chat",
      id: crypto.randomUUID(),
      text,
      time: now(),
    };

    connection.send(message);
    setMessages((current) => [
      ...current,
      { id: message.id, sender: "me", text: message.text, time: message.time },
    ]);
    setDraft("");
  };

  const leave = () => {
    connectionRef.current?.close();
    peerRef.current?.destroy();
    connectionRef.current = null;
    peerRef.current = null;
    setConnected(false);
    setConnecting(false);
    setHostPeerId("");
    setRoomId("");
    setPassword("");
    setMessages([]);
    setMode("choose");
  };

  useEffect(() => {
    return () => {
      connectionRef.current?.close();
      peerRef.current?.destroy();
    };
  }, []);

  if (mode === "choose") {
    return (
      <main className="p2p-page">
        <div className="p2p-shell p2p-center">
          <a href="/" className="p2p-brand">
            <img src="/logo-header.png" alt="WHOLEGACY" />
            <span>WHOLEGACY</span>
          </a>

          <div className="p2p-hero">
            <div className="p2p-kicker">PRIVATE PEER-TO-PEER CHAT</div>
            <h1>Talk privately.<br /><em>Directly.</em></h1>
            <p>
              Create a temporary room, share the invite link and password,
              then chat directly between the two browsers.
            </p>
          </div>

          <div className="p2p-choice-grid">
            <button className="p2p-choice" onClick={createRoom}>
              <span className="p2p-choice-number">01</span>
              <strong>Create a room</strong>
              <small>Generate a private room, password and invite link.</small>
            </button>

            <button className="p2p-choice" onClick={() => setMode("join")}>
              <span className="p2p-choice-number">02</span>
              <strong>Join a room</strong>
              <small>Enter the room details provided by someone you trust.</small>
            </button>
          </div>

          <div className="p2p-note">
            <span>●</span> No account required · No chat history stored by WHOLEGACY
          </div>
        </div>
      </main>
    );
  }

  if (mode === "join") {
    return (
      <main className="p2p-page">
        <div className="p2p-shell p2p-center">
          <a href="/" className="p2p-brand">
            <img src="/logo-header.png" alt="WHOLEGACY" />
            <span>WHOLEGACY</span>
          </a>

          <div className="p2p-panel">
            <div className="p2p-kicker">JOIN PRIVATE ROOM</div>
            <h1>Enter the room.</h1>
            <p>Use the room ID and password shared with you.</p>

            <label>ROOM ID</label>
            <input
              value={joinRoom}
              onChange={(e) => setJoinRoom(e.target.value.toUpperCase())}
              placeholder="XXXXXXXX"
              autoComplete="off"
            />

            <label>PASSWORD</label>
            <input
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
              placeholder="Room password"
              type="password"
              autoComplete="off"
            />

            <button
              className="p2p-primary"
              onClick={join}
              disabled={connecting || !joinRoom || !joinPassword || !hostPeerId}
            >
              {connecting ? "Connecting…" : "Enter private room →"}
            </button>

            {!hostPeerId && (
              <div className="p2p-error">
                Open the complete invite link from the room creator.
              </div>
            )}

            {messages.filter((m) => m.sender === "system").map((m) => (
              <div className="p2p-status-message" key={m.id}>{m.text}</div>
            ))}

            <button className="p2p-back" onClick={() => setMode("choose")}>
              ← Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p2p-page">
      <div className="p2p-chat-shell">
        <header className="p2p-chat-header">
          <div>
            <a href="/" className="p2p-mini-brand">
              <img src="/logo-header.png" alt="WHOLEGACY" />
              <span>WHOLEGACY / PRIVATE CHAT</span>
            </a>
            <div className="p2p-room-line">
              ROOM <strong>{roomId}</strong>
              <span className={connected ? "online" : ""}>
                ● {connected ? "CONNECTED" : connecting ? "CONNECTING" : "WAITING"}
              </span>
            </div>
          </div>
          <button className="p2p-leave" onClick={leave}>Leave</button>
        </header>

        <section className="p2p-invite">
          <div>
            <span>INVITE</span>
            <strong>Share this link + password</strong>
            <code>{shareUrl || "Generating secure peer address…"}</code>
          </div>
          <div className="p2p-invite-actions">
            <div className="p2p-password">
              <small>PASSWORD</small>
              <b>{password}</b>
            </div>
            <button onClick={copyInvite} disabled={!shareUrl}>
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </section>

        <section className="p2p-messages" aria-live="polite">
          {messages.length === 0 && (
            <div className="p2p-empty">
              <span>∞</span>
              <strong>Your private conversation starts here.</strong>
              <small>
                The chat uses a direct browser-to-browser connection.
              </small>
            </div>
          )}

          {messages.map((message) =>
            message.sender === "system" ? (
              <div className="p2p-system" key={message.id}>
                <span>{message.text}</span>
              </div>
            ) : (
              <div className={`p2p-message ${message.sender}`} key={message.id}>
                <div>{message.text}</div>
                <time>{message.time}</time>
              </div>
            )
          )}
        </section>

        <form
          className="p2p-composer"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={connected ? "Write a private message…" : "Waiting for the other person…"}
            disabled={!connected}
          />
          <button type="submit" disabled={!connected || !draft.trim()}>
            Send →
          </button>
        </form>
      </div>
    </main>
  );
}
