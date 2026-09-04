"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type Peer from "peerjs";
import type { DataConnection } from "peerjs";

type Mode = "choose" | "host" | "join";

type ChatMessage = {
  id: string;
  sender: "me" | "peer" | "system";
  text: string;
  time: string;
};

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const PEER_OPTIONS = {
  debug: 2,

  config: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  },
};

function randomString(length: number) {
  const bytes = new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) =>
      ALPHABET[
        byte % ALPHABET.length
      ]
  ).join("");
}

function getTime() {
  return new Date().toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function WebChatPage() {
  /*
   * =====================================================
   * STATE
   * =====================================================
   */

  const [mode, setMode] =
    useState<Mode>("choose");

  const [roomId, setRoomId] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [hostPeerId, setHostPeerId] =
    useState("");

  const [joinRoom, setJoinRoom] =
    useState("");

  const [
    joinPassword,
    setJoinPassword,
  ] = useState("");

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    connecting,
    setConnecting,
  ] = useState(false);

  const [draft, setDraft] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  /*
   * =====================================================
   * REFS
   * =====================================================
   */

  const peerRef =
    useRef<Peer | null>(null);

  const connectionRef =
    useRef<DataConnection | null>(
      null
    );

  const roomIdRef =
    useRef("");

  const passwordRef =
    useRef("");

  const roleRef =
    useRef<"host" | "guest" | null>(
      null
    );

  const connectTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const authTimeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /*
   * =====================================================
   * URL QUERY
   * =====================================================
   */

  const query = useMemo(() => {
    if (
      typeof window === "undefined"
    ) {
      return null;
    }

    return new URLSearchParams(
      window.location.search
    );
  }, []);

  /*
   * =====================================================
   * READ INVITATION
   * =====================================================
   */

  useEffect(() => {
    const queryRoom =
      query?.get("room") || "";

    const queryPeer =
      query?.get("peer") || "";

    if (
      queryRoom &&
      queryPeer
    ) {
      const cleanRoom =
        queryRoom.toUpperCase();

      setJoinRoom(cleanRoom);

      setHostPeerId(queryPeer);

      setMode("join");
    }
  }, [query]);

  /*
   * =====================================================
   * SYSTEM MESSAGE
   * =====================================================
   */

  const addSystem =
    useCallback(
      (text: string) => {
        setMessages(
          (current) => [
            ...current,

            {
              id:
                crypto.randomUUID(),

              sender: "system",

              text,

              time:
                getTime(),
            },
          ]
        );
      },
      []
    );

  /*
   * =====================================================
   * CLEAR TIMERS
   * =====================================================
   */

  const clearTimers =
    useCallback(() => {
      if (
        connectTimeoutRef.current
      ) {
        clearTimeout(
          connectTimeoutRef.current
        );

        connectTimeoutRef.current =
          null;
      }

      if (
        authTimeoutRef.current
      ) {
        clearTimeout(
          authTimeoutRef.current
        );

        authTimeoutRef.current =
          null;
      }
    }, []);

  /*
   * =====================================================
   * DATA CONNECTION
   * =====================================================
   */

  const attachConnection =
    useCallback(
      (
        connection: DataConnection,
        role: "host" | "guest",
        guestRoom?: string,
        guestPassword?: string
      ) => {
        console.log(
          "[WHOLEGACY P2P] attaching",
          role,
          connection.peer
        );

        connectionRef.current =
          connection;

        /*
         * Prevent infinite connecting.
         */

        connectTimeoutRef.current =
          setTimeout(() => {
            if (
              !connection.open
            ) {
              console.error(
                "[WHOLEGACY P2P] WebRTC connection timeout"
              );

              connection.close();

              setConnecting(false);
              setConnected(false);

              addSystem(
                "Connection timed out. The browsers could not establish a direct WebRTC connection."
              );
            }
          }, 15000);

        /*
         * WEBRTC DATA CHANNEL OPEN
         */

        connection.on(
          "open",
          () => {
            console.log(
              "[WHOLEGACY P2P] DataConnection OPEN"
            );

            if (
              connectTimeoutRef.current
            ) {
              clearTimeout(
                connectTimeoutRef.current
              );

              connectTimeoutRef.current =
                null;
            }

            /*
             * GUEST
             *
             * Send room authentication
             * only AFTER WebRTC connection
             * is completely open.
             */

            if (
              role === "guest"
            ) {
              console.log(
                "[WHOLEGACY P2P] Sending authentication"
              );

              connection.send({
                type: "auth",

                room:
                  guestRoom?.toUpperCase() ||
                  "",

                password:
                  guestPassword ||
                  "",
              });

              addSystem(
                "Peer connected. Verifying room access…"
              );

              /*
               * Authentication timeout.
               */

              authTimeoutRef.current =
                setTimeout(() => {
                  if (
                    !connected
                  ) {
                    console.error(
                      "[WHOLEGACY P2P] Authentication timeout"
                    );

                    setConnecting(
                      false
                    );

                    addSystem(
                      "Room authentication timed out."
                    );
                  }
                }, 10000);

              return;
            }

            /*
             * HOST
             */

            addSystem(
              "Peer connection established. Waiting for authentication…"
            );
          }
        );

        /*
         * =================================================
         * RECEIVE DATA
         * =================================================
         */

        connection.on(
          "data",
          (raw) => {
            const data =
              raw as {
                type?: string;
                room?: string;
                password?: string;
                id?: string;
                text?: string;
                time?: string;
              };

            console.log(
              "[WHOLEGACY P2P] DATA",
              data.type
            );

            /*
             * =============================================
             * HOST AUTHENTICATION
             * =============================================
             */

            if (
              role === "host" &&
              data.type ===
                "auth"
            ) {
              const receivedRoom =
                (
                  data.room || ""
                ).toUpperCase();

              const receivedPassword =
                data.password ||
                "";

              console.log(
                "[WHOLEGACY P2P] AUTH ROOM",
                receivedRoom
              );

              console.log(
                "[WHOLEGACY P2P] EXPECT ROOM",
                roomIdRef.current
              );

              const valid =
                receivedRoom ===
                  roomIdRef.current &&
                receivedPassword ===
                  passwordRef.current;

              console.log(
                "[WHOLEGACY P2P] AUTH VALID:",
                valid
              );

              if (valid) {
                connection.send({
                  type:
                    "auth-ok",
                });

                setConnected(
                  true
                );

                setConnecting(
                  false
                );

                addSystem(
                  "The other person joined the private room."
                );
              } else {
                connection.send({
                  type:
                    "auth-failed",
                });

                addSystem(
                  "A connection attempt was rejected because the room ID or password was incorrect."
                );

                setTimeout(
                  () => {
                    connection.close();
                  },
                  300
                );
              }

              return;
            }

            /*
             * =============================================
             * GUEST AUTH SUCCESS
             * =============================================
             */

            if (
              role === "guest" &&
              data.type ===
                "auth-ok"
            ) {
              console.log(
                "[WHOLEGACY P2P] Authentication successful"
              );

              if (
                authTimeoutRef.current
              ) {
                clearTimeout(
                  authTimeoutRef.current
                );

                authTimeoutRef.current =
                  null;
              }

              const currentRoom =
                (
                  guestRoom ||
                  joinRoom
                ).toUpperCase();

              roomIdRef.current =
                currentRoom;

              setRoomId(
                currentRoom
              );

              setConnected(
                true
              );

              setConnecting(
                false
              );

              addSystem(
                "Room access verified. Private chat connected."
              );

              return;
            }

            /*
             * =============================================
             * GUEST AUTH FAILURE
             * =============================================
             */

            if (
              role === "guest" &&
              data.type ===
                "auth-failed"
            ) {
              if (
                authTimeoutRef.current
              ) {
                clearTimeout(
                  authTimeoutRef.current
                );

                authTimeoutRef.current =
                  null;
              }

              setConnected(
                false
              );

              setConnecting(
                false
              );

              addSystem(
                "Incorrect room password."
              );

              setTimeout(
                () => {
                  connection.close();
                },
                250
              );

              return;
            }

            /*
             * =============================================
             * CHAT MESSAGE
             * =============================================
             */

            if (
              data.type ===
                "chat" &&
              typeof data.text ===
                "string"
            ) {
              setMessages(
                (current) => [
                  ...current,

                  {
                    id:
                      data.id ||
                      crypto.randomUUID(),

                    sender:
                      "peer",

                    text:
                      data.text || "",

                    time:
                      data.time ||
                      getTime(),
                  },
                ]
              );
            }
          }
        );

        /*
         * =================================================
         * CONNECTION ERROR
         * =================================================
         */

        connection.on(
          "error",
          (error) => {
            console.error(
              "[WHOLEGACY P2P] DataConnection ERROR",
              error
            );

            clearTimers();

            setConnecting(
              false
            );

            setConnected(
              false
            );

            addSystem(
              "Peer-to-peer connection error."
            );
          }
        );

        /*
         * =================================================
         * CONNECTION CLOSED
         * =================================================
         */

        connection.on(
          "close",
          () => {
            console.log(
              "[WHOLEGACY P2P] DataConnection CLOSED"
            );

            clearTimers();

            if (
              connectionRef.current ===
              connection
            ) {
              connectionRef.current =
                null;
            }

            setConnecting(
              false
            );

            setConnected(
              false
            );

            addSystem(
              "Peer disconnected."
            );
          }
        );
      },
      [
        addSystem,
        clearTimers,
        connected,
        joinRoom,
      ]
    );

  /*
   * =====================================================
   * CREATE ROOM
   * =====================================================
   */

  const createRoom =
    async () => {
      /*
       * Destroy previous instance
       */

      peerRef.current?.destroy();

      peerRef.current = null;

      connectionRef.current =
        null;

      clearTimers();

      setMessages([]);

      setConnected(false);

      setConnecting(true);

      setHostPeerId("");

      /*
       * Generate room credentials
       */

      const newRoom =
        randomString(8);

      const newPassword =
        randomString(10);

      /*
       * Store immediately in refs.
       */

      roomIdRef.current =
        newRoom;

      passwordRef.current =
        newPassword;

      roleRef.current =
        "host";

      setRoomId(
        newRoom
      );

      setPassword(
        newPassword
      );

      setMode(
        "host"
      );

      try {
        const {
          default: PeerJS,
        } = await import(
          "peerjs"
        );

        const peer =
          new PeerJS(
            PEER_OPTIONS
          );

        peerRef.current =
          peer;

        /*
         * IMPORTANT:
         * connection listener is attached
         * immediately.
         */

        peer.on(
          "connection",
          (
            connection:
              DataConnection
          ) => {
            console.log(
              "[WHOLEGACY P2P] Incoming peer:",
              connection.peer
            );

            /*
             * Only one conversation.
             */

            if (
              connectionRef.current &&
              connectionRef.current.open
            ) {
              connection.close();

              return;
            }

            attachConnection(
              connection,
              "host"
            );
          }
        );

        /*
         * Signaling server ready.
         */

        peer.on(
          "open",
          (id) => {
            console.log(
              "[WHOLEGACY P2P] HOST PeerJS ready:",
              id
            );

            setHostPeerId(
              id
            );

            setConnecting(
              false
            );

            addSystem(
              "Private room ready. Share the invite link and password."
            );
          }
        );

        peer.on(
          "disconnected",
          () => {
            console.warn(
              "[WHOLEGACY P2P] Host disconnected from signaling server"
            );
          }
        );

        peer.on(
          "error",
          (error) => {
            console.error(
              "[WHOLEGACY P2P] HOST PEER ERROR",
              error.type,
              error
            );

            setConnecting(
              false
            );

            if (
              error.type ===
              "network"
            ) {
              addSystem(
                "Unable to connect to the PeerJS signaling server."
              );

              return;
            }

            addSystem(
              `Peer error: ${error.type}`
            );
          }
        );
      } catch (error) {
        console.error(
          "[WHOLEGACY P2P] Create room failed",
          error
        );

        setConnecting(false);

        addSystem(
          "Unable to initialize PeerJS."
        );
      }
    };

  /*
   * =====================================================
   * JOIN ROOM
   * =====================================================
   */

  const joinRoomNow =
    async () => {
      const cleanRoom =
        joinRoom
          .trim()
          .toUpperCase();

      const cleanPassword =
        joinPassword.trim();

      const cleanHostPeer =
        hostPeerId.trim();

      if (
        !cleanRoom ||
        !cleanPassword ||
        !cleanHostPeer
      ) {
        return;
      }

      /*
       * Clean previous peer.
       */

      peerRef.current?.destroy();

      peerRef.current =
        null;

      connectionRef.current =
        null;

      clearTimers();

      setConnecting(true);

      setConnected(false);

      roleRef.current =
        "guest";

      roomIdRef.current =
        cleanRoom;

      passwordRef.current =
        cleanPassword;

      try {
        const {
          default: PeerJS,
        } = await import(
          "peerjs"
        );

        /*
         * Create GUEST PeerJS instance.
         */

        const peer =
          new PeerJS(
            PEER_OPTIONS
          );

        peerRef.current =
          peer;

        /*
         * General errors.
         */

        peer.on(
          "error",
          (error) => {
            console.error(
              "[WHOLEGACY P2P] GUEST PEER ERROR",
              error.type,
              error
            );

            setConnecting(
              false
            );

            setConnected(
              false
            );

            switch (
              error.type
            ) {
              case "peer-unavailable":
                addSystem(
                  "The room creator is no longer online or the room has expired."
                );
                break;

              case "network":
                addSystem(
                  "Unable to reach the PeerJS signaling server."
                );
                break;

              case "webrtc":
                addSystem(
                  "The browsers could not establish a WebRTC connection."
                );
                break;

              default:
                addSystem(
                  `Connection error: ${error.type}`
                );
            }
          }
        );

        /*
         * CRITICAL FIX:
         *
         * DO NOT call peer.connect()
         * until GUEST PeerJS itself is OPEN.
         */

        const peerOpenTimeout =
          setTimeout(() => {
            if (!peer.open) {
              console.error(
                "[WHOLEGACY P2P] Guest signaling timeout"
              );

              setConnecting(
                false
              );

              addSystem(
                "Could not connect to the signaling server."
              );

              peer.destroy();
            }
          }, 12000);

        peer.on(
          "open",
          (guestPeerId) => {
            clearTimeout(
              peerOpenTimeout
            );

            console.log(
              "[WHOLEGACY P2P] GUEST PeerJS ready:",
              guestPeerId
            );

            console.log(
              "[WHOLEGACY P2P] Connecting to HOST:",
              cleanHostPeer
            );

            /*
             * Only now create WebRTC
             * DataConnection.
             */

            const connection =
              peer.connect(
                cleanHostPeer,
                {
                  reliable:
                    true,

                  serialization:
                    "json",
                }
              );

            attachConnection(
              connection,
              "guest",
              cleanRoom,
              cleanPassword
            );
          }
        );
      } catch (error) {
        console.error(
          "[WHOLEGACY P2P] Join failed",
          error
        );

        setConnecting(
          false
        );

        addSystem(
          "Unable to initialize PeerJS."
        );
      }
    };

  /*
   * =====================================================
   * SHARE LINK
   * =====================================================
   */

  const shareUrl =
    typeof window !==
      "undefined" &&
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
   * =====================================================
   * COPY
   * =====================================================
   */

  const copyInvite =
    async () => {
      if (!shareUrl) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          shareUrl
        );

        setCopied(true);

        setTimeout(
          () => {
            setCopied(false);
          },
          1500
        );
      } catch (error) {
        console.error(
          "[WHOLEGACY P2P] Clipboard error",
          error
        );
      }
    };

  /*
   * =====================================================
   * SEND MESSAGE
   * =====================================================
   */

  const sendMessage =
    () => {
      const text =
        draft.trim();

      const connection =
        connectionRef.current;

      if (
        !connected ||
        !connection ||
        !connection.open ||
        !text
      ) {
        return;
      }

      const message = {
        type: "chat",

        id:
          crypto.randomUUID(),

        text,

        time:
          getTime(),
      };

      try {
        connection.send(
          message
        );

        setMessages(
          (current) => [
            ...current,

            {
              id:
                message.id,

              sender:
                "me",

              text:
                message.text,

              time:
                message.time,
            },
          ]
        );

        setDraft("");
      } catch (error) {
        console.error(
          "[WHOLEGACY P2P] Send failed",
          error
        );

        addSystem(
          "Message could not be sent."
        );
      }
    };

  /*
   * =====================================================
   * LEAVE
   * =====================================================
   */

  const leave =
    () => {
      clearTimers();

      connectionRef.current?.close();

      peerRef.current?.destroy();

      connectionRef.current =
        null;

      peerRef.current =
        null;

      roomIdRef.current =
        "";

      passwordRef.current =
        "";

      roleRef.current =
        null;

      setMode(
        "choose"
      );

      setRoomId("");

      setPassword("");

      setJoinRoom("");

      setJoinPassword("");

      setHostPeerId("");

      setConnected(false);

      setConnecting(false);

      setDraft("");

      setMessages([]);

      if (
        typeof window !==
        "undefined"
      ) {
        window.history.replaceState(
          {},
          "",
          "/webchat"
        );
      }
    };

  /*
   * =====================================================
   * CLEANUP
   * =====================================================
   */

  useEffect(() => {
    return () => {
      clearTimers();

      connectionRef.current?.close();

      peerRef.current?.destroy();
    };
  }, [clearTimers]);

  /*
   * =====================================================
   * HOME
   * =====================================================
   */

  if (
    mode === "choose"
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

          <div className="p2p-hero">
            <div className="p2p-kicker">
              PRIVATE PEER-TO-PEER
              CHAT
            </div>

            <h1>
              Talk privately.
              <br />

              <em>
                Directly.
              </em>
            </h1>

            <p>
              Create a temporary
              room, share the invite
              link and password, then
              chat directly between
              the two browsers.
            </p>
          </div>

          <div className="p2p-choice-grid">
            <button
              className="p2p-choice"
              onClick={
                createRoom
              }
            >
              <span className="p2p-choice-number">
                01
              </span>

              <strong>
                Create a room
              </strong>

              <small>
                Generate a private
                room, password and
                invite link.
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
                Enter a private
                invitation.
              </small>
            </button>
          </div>

          <div className="p2p-note">
            <span>●</span>

            No account required ·
            No chat history stored
            by WHOLEGACY
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * JOIN FORM
   * =====================================================
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
              Use the room ID and
              password shared with
              you.
            </p>

            <label>
              ROOM ID
            </label>

            <input
              value={
                joinRoom
              }
              onChange={(
                event
              ) =>
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
              value={
                joinPassword
              }
              onChange={(
                event
              ) =>
                setJoinPassword(
                  event.target.value
                )
              }
              type="password"
              placeholder="Room password"
              autoComplete="off"
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                    "Enter" &&
                  !connecting
                ) {
                  joinRoomNow();
                }
              }}
            />

            <button
              className="p2p-primary"
              onClick={
                joinRoomNow
              }
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
                Open the complete
                invitation link from
                the room creator.
              </div>
            )}

            {messages
              .filter(
                (message) =>
                  message.sender ===
                  "system"
              )
              .map(
                (message) => (
                  <div
                    className="p2p-status-message"
                    key={
                      message.id
                    }
                  >
                    {
                      message.text
                    }
                  </div>
                )
              )}

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
   * =====================================================
   * CHAT
   * =====================================================
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
                WHOLEGACY /
                PRIVATE CHAT
              </span>
            </a>

            <div className="p2p-room-line">
              ROOM{" "}

              <strong>
                {roomId ||
                  joinRoom}
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
                Share this link +
                password
              </strong>

              <code>
                {shareUrl ||
                  "Generating peer address…"}
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
                onClick={
                  copyInvite
                }
                disabled={
                  !shareUrl
                }
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
          {messages.length ===
            0 && (
            <div className="p2p-empty">
              <span>
                ∞
              </span>

              <strong>
                Your private
                conversation starts
                here.
              </strong>

              <small>
                Browser-to-browser
                private connection.
              </small>
            </div>
          )}

          {messages.map(
            (message) => {
              if (
                message.sender ===
                "system"
              ) {
                return (
                  <div
                    className="p2p-system"
                    key={
                      message.id
                    }
                  >
                    <span>
                      {
                        message.text
                      }
                    </span>
                  </div>
                );
              }

              return (
                <div
                  className={`p2p-message ${message.sender}`}
                  key={
                    message.id
                  }
                >
                  <div>
                    {
                      message.text
                    }
                  </div>

                  <time>
                    {
                      message.time
                    }
                  </time>
                </div>
              );
            }
          )}
        </section>

        <form
          className="p2p-composer"
          onSubmit={(
            event
          ) => {
            event.preventDefault();

            sendMessage();
          }}
        >
          <input
            value={draft}
            onChange={(
              event
            ) =>
              setDraft(
                event.target.value
              )
            }
            placeholder={
              connected
                ? "Write a private message…"
                : "Waiting for connection…"
            }
            disabled={
              !connected
            }
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
