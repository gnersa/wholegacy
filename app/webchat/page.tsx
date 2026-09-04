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
  connect: (
    peerId: string,
    options?: Record<string, unknown>
  ) => DataConnection;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomString(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) => ALPHABET[byte % ALPHABET.length]
  ).join("");
}

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WebChatPage() {
  const [mode, setMode] = useState<"choose" | "host" | "join">(
    "choose"
  );

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

  const roomIdRef = useRef("");
  const passwordRef = useRef("");

  const isHostRef = useRef(false);

  /*
   * =========================================
   * URL QUERY
   * =========================================
   */

  const query = useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return new URLSearchParams(window.location.search);
  }, []);

  /*
   * =========================================
   * READ INVITE LINK
   * =========================================
   */

  useEffect(() => {
    const room = query?.get("room") || "";
    const peer = query?.get("peer") || "";

    if (room && peer) {
      setJoinRoom(room.toUpperCase());
      setHostPeerId(peer);
      setMode("join");
    }
  }, [query]);

  /*
   * =========================================
   * SYSTEM MESSAGE
   * =========================================
   */

  const addSystem = useCallback((text: string) => {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        sender: "system",
        text,
        time: now(),
      },
    ]);
  }, []);

  /*
   * =========================================
   * ATTACH P2P CONNECTION
   * =========================================
   */

  const attachConnection = useCallback(
    (
      connection: DataConnection,
      host: boolean,
      joinRoomValue?: string,
      joinPasswordValue?: string
    ) => {
      connectionRef.current = connection;

      /*
       * CONNECTION OPEN
       */
      connection.on("open", () => {
        console.log("[P2P] Connection open");

        if (!host) {
          connection.send({
            type: "auth",
            room: joinRoomValue?.toUpperCase() || "",
            password: joinPasswordValue || "",
          });

          addSystem(
            "Connected to peer. Authenticating room access…"
          );

          return;
        }

        addSystem(
          "Peer connected. Waiting for room authentication…"
        );
      });

      /*
       * RECEIVE DATA
       */
      connection.on("data", (raw) => {
        const data = raw as any;

        console.log("[P2P] Received data:", data);

        /*
         * HOST RECEIVES AUTH
         */
        if (host && data?.type === "auth") {
          const receivedRoom =
            typeof data.room === "string"
              ? data.room.toUpperCase()
              : "";

          const receivedPassword =
            typeof data.password === "string"
              ? data.password
              : "";

          const valid =
            receivedRoom === roomIdRef.current &&
            receivedPassword === passwordRef.current;

          console.log("[P2P] Auth result:", valid);

          if (valid) {
            connection.send({
              type: "auth-ok",
            });

            setConnected(true);
            setConnecting(false);

            addSystem(
              "The other person joined the private room."
            );
          } else {
            connection.send({
              type: "auth-failed",
            });

            addSystem(
              "A connection attempt was rejected."
            );

            setTimeout(() => {
              connection.close();
            }, 300);
          }

          return;
        }

        /*
         * USER 2 AUTH SUCCESS
         */
        if (!host && data?.type === "auth-ok") {
          setConnected(true);
          setConnecting(false);

          const finalRoom =
            joinRoomValue?.toUpperCase() ||
            joinRoom.toUpperCase();

          setRoomId(finalRoom);

          addSystem(
            "Room access verified. You can now chat."
          );

          return;
        }

        /*
         * USER 2 AUTH FAILED
         */
        if (!host && data?.type === "auth-failed") {
          setConnected(false);
          setConnecting(false);

          addSystem(
            "Incorrect password or room details."
          );

          setTimeout(() => {
            connection.close();
          }, 200);

          return;
        }

        /*
         * CHAT MESSAGE
         */
        if (
          data?.type === "chat" &&
          typeof data.text === "string"
        ) {
          setMessages((current) => [
            ...current,
            {
              id:
                typeof data.id === "string"
                  ? data.id
                  : crypto.randomUUID(),

              sender: "peer",

              text: data.text,

              time:
                typeof data.time === "string"
                  ? data.time
                  : now(),
            },
          ]);

          return;
        }
      });

      /*
       * CONNECTION CLOSE
       */
      connection.on("close", () => {
        console.log("[P2P] Connection closed");

        if (
          connectionRef.current === connection
        ) {
          connectionRef.current = null;
        }

        setConnected(false);
        setConnecting(false);

        addSystem(
          "The peer disconnected."
        );
      });

      /*
       * CONNECTION ERROR
       */
      connection.on("error", (error) => {
        console.error(
          "[P2P] Data connection error:",
          error
        );

        setConnected(false);
        setConnecting(false);

        addSystem(
          "The peer-to-peer connection encountered an error."
        );
      });
    },
    [
      addSystem,
      joinRoom,
    ]
  );

  /*
   * =========================================
   * CREATE PEER INSTANCE
   * =========================================
   */

  const loadPeer = useCallback(async () => {
    if (peerRef.current) {
      return peerRef.current;
    }

    const module = await import("peerjs");

    const PeerCtor = module.default;

    const peer = new PeerCtor({
      debug: 1,
    }) as unknown as PeerLike;

    peerRef.current = peer;

    return peer;
  }, []);

  /*
   * =========================================
   * CREATE ROOM
   * =========================================
   */

  const createRoom = async () => {
    setConnecting(true);
    setConnected(false);

    const newRoom = randomString(8);
    const newPassword = randomString(10);

    /*
     * IMPORTANT:
     * Store values in refs immediately.
     * This prevents stale React state inside
     * PeerJS callbacks.
     */
    roomIdRef.current = newRoom;
    passwordRef.current = newPassword;

    isHostRef.current = true;

    setRoomId(newRoom);
    setPassword(newPassword);

    setHostPeerId("");

    setMessages([]);

    setMode("host");

    try {
      const peer = await loadPeer();

      /*
       * PEER SERVER OPEN
       */
      peer.on("open", (id: string) => {
        console.log(
          "[P2P] Host Peer ID:",
          id
        );

        setHostPeerId(id);

        setConnecting(false);

        addSystem(
          "Private room created. Share the link and password."
        );
      });

      /*
       * INCOMING PEER CONNECTION
       */
      peer.on(
        "connection",
        (connection: DataConnection) => {
          console.log(
            "[P2P] Incoming connection:",
            connection.peer
          );

          attachConnection(
            connection,
            true
          );
        }
      );

      /*
       * PEER ERROR
       */
      peer.on("error", (error: any) => {
        console.error(
          "[P2P] Host peer error:",
          error
        );

        setConnecting(false);
        setConnected(false);

        addSystem(
          "Unable to initialize the P2P room. Please try again."
        );
      });
    } catch (error) {
      console.error(
        "[P2P] Host initialization failed:",
        error
      );

      setConnecting(false);

      addSystem(
        "Peer-to-peer service could not be loaded."
      );
    }
  };

  /*
   * =========================================
   * JOIN ROOM
   * =========================================
   */

  const join = async () => {
    const cleanRoom =
      joinRoom.trim().toUpperCase();

    const cleanPassword =
      joinPassword.trim();

    if (
      !cleanRoom ||
      !cleanPassword ||
      !hostPeerId
    ) {
      return;
    }

    setConnecting(true);
    setConnected(false);

    isHostRef.current = false;

    roomIdRef.current = cleanRoom;
    passwordRef.current = cleanPassword;

    try {
      const peer = await loadPeer();

      peer.on("open", (id: string) => {
        console.log(
          "[P2P] Guest Peer ID:",
          id
        );
      });

      peer.on("error", (error: any) => {
        console.error(
          "[P2P] Guest peer error:",
          error
        );

        setConnecting(false);
        setConnected(false);

        addSystem(
          "Could not reach the room. Check the link and try again."
        );
      });

      console.log(
        "[P2P] Connecting to host:",
        hostPeerId
      );

      const connection = peer.connect(
        hostPeerId,
        {
          reliable: true,
        }
      );

      attachConnection(
        connection,
        false,
        cleanRoom,
        cleanPassword
      );
    } catch (error) {
      console.error(
        "[P2P] Guest connection failed:",
        error
      );

      setConnecting(false);

      addSystem(
        "Peer-to-peer service could not be loaded."
      );
    }
  };

  /*
   * =========================================
   * SHARE URL
   * =========================================
   */

  const shareUrl =
    typeof window !== "undefined" &&
    hostPeerId
      ? `${
          window.location.origin
        }/webchat?room=${encodeURIComponent(
          roomId
        )}&peer=${encodeURIComponent(
          hostPeerId
        )}`
      : "";

  /*
   * =========================================
   * COPY INVITE
   * =========================================
   */

  const copyInvite = async () => {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        shareUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  };

  /*
   * =========================================
   * SEND CHAT MESSAGE
   * =========================================
   */

  const sendMessage = () => {
    const text = draft.trim();

    const connection =
      connectionRef.current;

    if (
      !text ||
      !connection ||
      !connected
    ) {
      return;
    }

    const message = {
      type: "chat",
      id: crypto.randomUUID(),
      text,
      time: now(),
    };

    connection.send(message);

    setMessages((current) => [
      ...current,
      {
        id: message.id,
        sender: "me",
        text: message.text,
        time: message.time,
      },
    ]);

    setDraft("");
  };

  /*
   * =========================================
   * LEAVE ROOM
   * =========================================
   */

  const leave = () => {
    connectionRef.current?.close();

    peerRef.current?.destroy();

    connectionRef.current = null;
    peerRef.current = null;

    roomIdRef.current = "";
    passwordRef.current = "";

    isHostRef.current = false;

    setConnected(false);
    setConnecting(false);

    setHostPeerId("");

    setRoomId("");
    setPassword("");

    setJoinRoom("");
    setJoinPassword("");

    setMessages([]);

    setDraft("");

    setMode("choose");

    if (
      typeof window !== "undefined"
    ) {
      window.history.replaceState(
        {},
        "",
        "/webchat"
      );
    }
  };

  /*
   * =========================================
   * CLEANUP
   * =========================================
   */

  useEffect(() => {
    return () => {
      connectionRef.current?.close();
      peerRef.current?.destroy();

      connectionRef.current = null;
      peerRef.current = null;
    };
  }, []);

  /*
   * =========================================
   * HOME / CHOOSE
   * =========================================
   */

  if (mode === "choose") {
    return (
      <main className="p2p-page">
        <div className="p2p-shell p2p-center">
          <a
            href="/"
            className="p2p-brand"
          >
            <img
              src="/logo-header.png"
              alt="WHOLEGACY"
            />

            <span>
              WHOLEGACY
            </span>
          </a>

          <div className="p2p-hero">
            <div className="p2p-kicker">
              PRIVATE PEER-TO-PEER CHAT
            </div>

            <h1>
              Talk privately.
              <br />
              <em>Directly.</em>
            </h1>

            <p>
              Create a temporary room,
              share the invite link and
              password, then chat directly
              between the two browsers.
            </p>
          </div>

          <div className="p2p-choice-grid">
            <button
              className="p2p-choice"
              onClick={createRoom}
            >
              <span className="p2p-choice-number">
                01
              </span>

              <strong>
                Create a room
              </strong>

              <small>
                Generate a private room,
                password and invite link.
              </small>
            </button>

            <button
              className="p2p-choice"
              onClick={() =>
                setMode("join")
              }
            >
              <span className="p2p-choice-number">
                02
              </span>

              <strong>
                Join a room
              </strong>

              <small>
                Enter the room details
                provided by someone you trust.
              </small>
            </button>
          </div>

          <div className="p2p-note">
            <span>●</span>

            No account required · No chat
            history stored by WHOLEGACY
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================
   * JOIN SCREEN
   *
   * IMPORTANT:
   * When connected becomes true,
   * this screen disappears and the
   * chat screen is rendered.
   * =========================================
   */

  if (
    mode === "join" &&
    !connected
  ) {
    return (
      <main className="p2p-page">
        <div className="p2p-shell p2p-center">
          <a
            href="/"
            className="p2p-brand"
          >
            <img
              src="/logo-header.png"
              alt="WHOLEGACY"
            />

            <span>
              WHOLEGACY
            </span>
          </a>

          <div className="p2p-panel">
            <div className="p2p-kicker">
              JOIN PRIVATE ROOM
            </div>

            <h1>
              Enter the room.
            </h1>

            <p>
              Use the room ID and password
              shared with you.
            </p>

            <label>
              ROOM ID
            </label>

            <input
              value={joinRoom}
              onChange={(event) =>
                setJoinRoom(
                  event.target.value.toUpperCase()
                )
              }
              placeholder="XXXXXXXX"
              autoComplete="off"
            />

            <label>
              PASSWORD
            </label>

            <input
              value={joinPassword}
              onChange={(event) =>
                setJoinPassword(
                  event.target.value
                )
              }
              placeholder="Room password"
              type="password"
              autoComplete="off"
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !connecting
                ) {
                  join();
                }
              }}
            />

            <button
              className="p2p-primary"
              onClick={join}
              disabled={
                connecting ||
                !joinRoom.trim() ||
                !joinPassword.trim() ||
                !hostPeerId
              }
            >
              {connecting
                ? "Connecting…"
                : "Enter private room →"}
            </button>

            {!hostPeerId && (
              <div className="p2p-error">
                Open the complete invite
                link from the room creator.
              </div>
            )}

            {messages
              .filter(
                (message) =>
                  message.sender ===
                  "system"
              )
              .map((message) => (
                <div
                  className="p2p-status-message"
                  key={message.id}
                >
                  {message.text}
                </div>
              ))}

            <button
              className="p2p-back"
              onClick={leave}
            >
              ← Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================
   * CHAT SCREEN
   * =========================================
   */

  return (
    <main className="p2p-page">
      <div className="p2p-chat-shell">
        <header className="p2p-chat-header">
          <div>
            <a
              href="/"
              className="p2p-mini-brand"
            >
              <img
                src="/logo-header.png"
                alt="WHOLEGACY"
              />

              <span>
                WHOLEGACY / PRIVATE CHAT
              </span>
            </a>

            <div className="p2p-room-line">
              ROOM{" "}

              <strong>
                {roomId ||
                  joinRoom.toUpperCase()}
              </strong>

              <span
                className={
                  connected
                    ? "online"
                    : ""
                }
              >
                ●{" "}

                {connected
                  ? "CONNECTED"
                  : connecting
                  ? "CONNECTING"
                  : "WAITING"}
              </span>
            </div>
          </div>

          <button
            className="p2p-leave"
            onClick={leave}
          >
            Leave
          </button>
        </header>

        {mode === "host" && (
          <section className="p2p-invite">
            <div>
              <span>
                INVITE
              </span>

              <strong>
                Share this link + password
              </strong>

              <code>
                {shareUrl ||
                  "Generating secure peer address…"}
              </code>
            </div>

            <div className="p2p-invite-actions">
              <div className="p2p-password">
                <small>
                  PASSWORD
                </small>

                <b>
                  {password}
                </b>
              </div>

              <button
                onClick={copyInvite}
                disabled={!shareUrl}
              >
                {copied
                  ? "Copied ✓"
                  : "Copy link"}
              </button>
            </div>
          </section>
        )}

        <section
          className="p2p-messages"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="p2p-empty">
              <span>
                ∞
              </span>

              <strong>
                Your private conversation
                starts here.
              </strong>

              <small>
                The chat uses a direct
                browser-to-browser connection.
              </small>
            </div>
          )}

          {messages.map(
            (message) =>
              message.sender ===
              "system" ? (
                <div
                  className="p2p-system"
                  key={message.id}
                >
                  <span>
                    {message.text}
                  </span>
                </div>
              ) : (
                <div
                  className={`p2p-message ${message.sender}`}
                  key={message.id}
                >
                  <div>
                    {message.text}
                  </div>

                  <time>
                    {message.time}
                  </time>
                </div>
              )
          )}
        </section>

        <form
          className="p2p-composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={draft}
            onChange={(event) =>
              setDraft(
                event.target.value
              )
            }
            placeholder={
              connected
                ? "Write a private message…"
                : mode === "host"
                ? "Waiting for the other person…"
                : "Connecting…"
            }
            disabled={!connected}
          />

          <button
            type="submit"
            disabled={
              !connected ||
              !draft.trim()
            }
          >
            Send →
          </button>
        </form>
      </div>
    </main>
  );
}
