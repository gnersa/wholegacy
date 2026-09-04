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

type SharedFile = {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  sender: "me" | "peer";
  time: string;
};

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const PEER_OPTIONS = {
  debug: 2,

  config: {
    iceServers: [
      {
        urls:
          "stun:stun.l.google.com:19302",
      },
      {
        urls:
          "stun:stun1.l.google.com:19302",
      },

      /*
       * ==================================================
       * TURN SERVER
       * ==================================================
       *
       * Untuk koneksi lintas jaringan yang stabil,
       * tambahkan TURN server di sini.
       *
       * Contoh:
       *
       * {
       *   urls: "turn:turn.wholegacy.com:3478",
       *   username: "TEMP_USERNAME",
       *   credential: "TEMP_PASSWORD",
       * },
       *
       * {
       *   urls:
       *     "turn:turn.wholegacy.com:3478?transport=tcp",
       *   username: "TEMP_USERNAME",
       *   credential: "TEMP_PASSWORD",
       * },
       */
    ],
  },
};

function randomString(
  length: number
) {
  const bytes =
    new Uint8Array(length);

  crypto.getRandomValues(bytes);

  return Array.from(
    bytes,
    (byte) =>
      ALPHABET[
        byte %
          ALPHABET.length
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
   * ======================================================
   * STATE
   * ======================================================
   */

  const [
    mode,
    setMode,
  ] = useState<Mode>(
    "choose"
  );

  const [
    roomId,
    setRoomId,
  ] = useState("");

  const [
    hostPeerId,
    setHostPeerId,
  ] = useState("");

  /*
   * Host PIN.
   */

  const [
    pin,
    setPin,
  ] = useState("");

  /*
   * Guest PIN.
   */

  const [
    joinPin,
    setJoinPin,
  ] = useState("");

  const [
    joinRoom,
    setJoinRoom,
  ] = useState("");

  const [
    connected,
    setConnected,
  ] = useState(false);

  const [
    connecting,
    setConnecting,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] = useState("");

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    copiedPin,
    setCopiedPin,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState<
    ChatMessage[]
  >([]);

  const [
    files,
    setFiles,
  ] = useState<
    SharedFile[]
  >([]);

  /*
   * ======================================================
   * REFS
   * ======================================================
   */

  const peerRef =
    useRef<Peer | null>(
      null
    );

  const connectionRef =
    useRef<
      DataConnection | null
    >(null);

  const roomIdRef =
    useRef("");

  const pinRef =
    useRef("");

  const roleRef =
    useRef<
      "host" |
      "guest" |
      null
    >(null);

  const connectTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const authTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const fileInputRef =
    useRef<
      HTMLInputElement | null
    >(null);

  const cameraInputRef =
    useRef<
      HTMLInputElement | null
    >(null);

  /*
   * Store object URLs so cleanup
   * does not need to depend on files state.
   */

  const objectUrlsRef =
    useRef<string[]>([]);

  /*
   * ======================================================
   * INVITATION QUERY
   * ======================================================
   */

  const query =
    useMemo(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return null;
      }

      return new URLSearchParams(
        window.location.search
      );
    }, []);

  useEffect(() => {
    const queryRoom =
      query?.get("room") ||
      "";

    const queryPeer =
      query?.get("peer") ||
      "";

    if (
      queryRoom &&
      queryPeer
    ) {
      setJoinRoom(
        queryRoom.toUpperCase()
      );

      setHostPeerId(
        queryPeer
      );

      setMode(
        "join"
      );
    }
  }, [query]);

  /*
   * ======================================================
   * SYSTEM MESSAGE
   * ======================================================
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

              sender:
                "system",

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
   * ======================================================
   * CLEAR TIMERS
   * ======================================================
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
   * ======================================================
   * CLEAN OBJECT URL
   * ======================================================
   */

  const revokeObjectUrls =
    useCallback(() => {
      objectUrlsRef.current.forEach(
        (url) => {
          URL.revokeObjectURL(
            url
          );
        }
      );

      objectUrlsRef.current =
        [];
    }, []);

  /*
   * ======================================================
   * ATTACH CONNECTION
   * ======================================================
   */

  const attachConnection =
    useCallback(
      (
        connection:
          DataConnection,

        role:
          | "host"
          | "guest",

        guestRoom?: string,

        guestPin?: string
      ) => {
        connectionRef.current =
          connection;

        /*
         * WebRTC timeout.
         */

        connectTimeoutRef.current =
          setTimeout(() => {
            if (
              !connection.open
            ) {
              connection.close();

              setConnecting(
                false
              );

              setConnected(
                false
              );

              addSystem(
                "Connection timed out. The browsers could not establish a private connection."
              );
            }
          }, 15000);

        /*
         * ==================================================
         * DATA CONNECTION OPEN
         * ==================================================
         */

        connection.on(
          "open",
          () => {
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
             * Guest sends PIN only after
             * DataConnection is open.
             */

            if (
              role ===
              "guest"
            ) {
              connection.send({
                type:
                  "auth",

                room:
                  guestRoom?.toUpperCase() ||
                  "",

                pin:
                  guestPin ||
                  "",
              });

              addSystem(
                "Private connection established. Verifying PIN…"
              );

              authTimeoutRef.current =
                setTimeout(() => {
                  setConnecting(
                    false
                  );

                  addSystem(
                    "PIN verification timed out."
                  );
                }, 10000);

              return;
            }

            addSystem(
              "Peer connected. Waiting for PIN verification…"
            );
          }
        );

        /*
         * ==================================================
         * RECEIVE DATA
         * ==================================================
         */

        connection.on(
          "data",
          (raw) => {
            const data =
              raw as any;

            /*
             * ==============================================
             * HOST AUTHENTICATION
             * ==============================================
             */

            if (
              role ===
                "host" &&
              data?.type ===
                "auth"
            ) {
              const receivedRoom =
                String(
                  data.room ||
                    ""
                ).toUpperCase();

              const receivedPin =
                String(
                  data.pin ||
                    ""
                );

              const valid =
                receivedRoom ===
                  roomIdRef.current &&
                receivedPin ===
                  pinRef.current;

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
                  "A connection attempt was rejected because the PIN was incorrect."
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
             * ==============================================
             * GUEST AUTH SUCCESS
             * ==============================================
             */

            if (
              role ===
                "guest" &&
              data?.type ===
                "auth-ok"
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

              setJoinPin(
                ""
              );

              addSystem(
                "PIN accepted. Private chat connected."
              );

              return;
            }

            /*
             * ==============================================
             * GUEST AUTH FAILED
             * ==============================================
             */

            if (
              role ===
                "guest" &&
              data?.type ===
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

              setJoinPin(
                ""
              );

              addSystem(
                "Incorrect PIN. Please try again."
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
             * ==============================================
             * TEXT CHAT
             * ==============================================
             */

            if (
              data?.type ===
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
                      data.text,

                    time:
                      data.time ||
                      getTime(),
                  },
                ]
              );

              return;
            }

            /*
             * ==============================================
             * FILE / PHOTO
             * ==============================================
             */

            if (
              data?.type ===
                "file" &&
              data.buffer
            ) {
              try {
                const blob =
                  new Blob(
                    [
                      data.buffer,
                    ],
                    {
                      type:
                        data.mime ||
                        "application/octet-stream",
                    }
                  );

                const url =
                  URL.createObjectURL(
                    blob
                  );

                objectUrlsRef.current.push(
                  url
                );

                setFiles(
                  (current) => [
                    ...current,

                    {
                      id:
                        data.id ||
                        crypto.randomUUID(),

                      name:
                        data.name ||
                        "file",

                      mime:
                        data.mime ||
                        "application/octet-stream",

                      size:
                        data.size ||
                        blob.size,

                      url,

                      sender:
                        "peer",

                      time:
                        data.time ||
                        getTime(),
                    },
                  ]
                );
              } catch {
                addSystem(
                  "Received file could not be opened."
                );
              }

              return;
            }
          }
        );

        /*
         * ==================================================
         * ERROR
         * ==================================================
         */

        connection.on(
          "error",
          () => {
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
         * ==================================================
         * CLOSE
         * ==================================================
         */

        connection.on(
          "close",
          () => {
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

            /*
             * Don't show Peer disconnected
             * when authentication itself failed.
             */
          }
        );
      },
      [
        addSystem,
        clearTimers,
        joinRoom,
      ]
    );

  /*
   * ======================================================
   * CREATE ROOM
   * ======================================================
   */

  const createRoom =
    async () => {
      const cleanPin =
        pin.trim();

      if (
        !/^\d{4,6}$/.test(
          cleanPin
        )
      ) {
        return;
      }

      peerRef.current?.destroy();

      peerRef.current =
        null;

      connectionRef.current =
        null;

      clearTimers();

      revokeObjectUrls();

      setMessages([]);

      setFiles([]);

      setConnected(
        false
      );

      setConnecting(
        true
      );

      setHostPeerId(
        ""
      );

      const newRoom =
        randomString(8);

      roomIdRef.current =
        newRoom;

      pinRef.current =
        cleanPin;

      roleRef.current =
        "host";

      setRoomId(
        newRoom
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
         * Incoming guest.
         */

        peer.on(
          "connection",
          (
            connection:
              DataConnection
          ) => {
            /*
             * Only one active peer.
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
         * Signaling ready.
         */

        peer.on(
          "open",
          (id) => {
            setHostPeerId(
              id
            );

            setConnecting(
              false
            );

            addSystem(
              "Private room ready. Share the link and PIN."
            );
          }
        );

        peer.on(
          "error",
          (error) => {
            setConnecting(
              false
            );

            if (
              error.type ===
              "network"
            ) {
              addSystem(
                "Unable to connect to the signaling server."
              );

              return;
            }

            addSystem(
              `Peer error: ${error.type}`
            );
          }
        );
      } catch {
        setConnecting(
          false
        );

        addSystem(
          "Unable to initialize private room."
        );
      }
    };

  /*
   * ======================================================
   * JOIN ROOM
   * ======================================================
   */

  const joinRoomNow =
    async () => {
      const cleanRoom =
        joinRoom
          .trim()
          .toUpperCase();

      const cleanPin =
        joinPin.trim();

      const cleanHostPeer =
        hostPeerId.trim();

      if (
        !cleanRoom ||
        !/^\d{4,6}$/.test(
          cleanPin
        ) ||
        !cleanHostPeer
      ) {
        return;
      }

      peerRef.current?.destroy();

      peerRef.current =
        null;

      connectionRef.current =
        null;

      clearTimers();

      setConnecting(
        true
      );

      setConnected(
        false
      );

      roleRef.current =
        "guest";

      roomIdRef.current =
        cleanRoom;

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
         * Guest signaling timeout.
         */

        const peerOpenTimeout =
          setTimeout(() => {
            if (
              !peer.open
            ) {
              setConnecting(
                false
              );

              addSystem(
                "Could not reach the private room."
              );

              peer.destroy();
            }
          }, 12000);

        peer.on(
          "open",
          () => {
            clearTimeout(
              peerOpenTimeout
            );

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
              cleanPin
            );
          }
        );

        peer.on(
          "error",
          (error) => {
            clearTimeout(
              peerOpenTimeout
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
                  "This private room is no longer available."
                );
                break;

              case "network":
                addSystem(
                  "Unable to reach the signaling server."
                );
                break;

              case "webrtc":
                addSystem(
                  "The browsers could not establish a private connection."
                );
                break;

              default:
                addSystem(
                  `Connection error: ${error.type}`
                );
            }
          }
        );
      } catch {
        setConnecting(
          false
        );

        addSystem(
          "Unable to open private room."
        );
      }
    };

  /*
   * ======================================================
   * PIN KEYPAD
   * ======================================================
   */

  const pressPin =
    (
      digit: string
    ) => {
      if (
        connecting
      ) {
        return;
      }

      setJoinPin(
        (current) => {
          if (
            current.length >=
            6
          ) {
            return current;
          }

          return (
            current +
            digit
          );
        }
      );
    };

  const deletePin =
    () => {
      if (
        connecting
      ) {
        return;
      }

      setJoinPin(
        (current) =>
          current.slice(
            0,
            -1
          )
      );
    };

  /*
   * ======================================================
   * SEND MESSAGE
   * ======================================================
   */

  const sendMessage =
    () => {
      const text =
        draft.trim();

      const connection =
        connectionRef.current;

      if (
        !text ||
        !connected ||
        !connection ||
        !connection.open
      ) {
        return;
      }

      const message = {
        type:
          "chat",

        id:
          crypto.randomUUID(),

        text,

        time:
          getTime(),
      };

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
    };

  /*
   * ======================================================
   * SEND FILE / CAMERA PHOTO
   * ======================================================
   */

  const sendFile =
    async (
      file: File
    ) => {
      const connection =
        connectionRef.current;

      if (
        !connected ||
        !connection ||
        !connection.open
      ) {
        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {
        addSystem(
          "Maximum file size is 10 MB."
        );

        return;
      }

      try {
        const buffer =
          await file.arrayBuffer();

        const id =
          crypto.randomUUID();

        const time =
          getTime();

        const mime =
          file.type ||
          "application/octet-stream";

        connection.send({
          type:
            "file",

          id,

          name:
            file.name,

          mime,

          size:
            file.size,

          buffer,

          time,
        });

        const url =
          URL.createObjectURL(
            file
          );

        objectUrlsRef.current.push(
          url
        );

        setFiles(
          (current) => [
            ...current,

            {
              id,

              name:
                file.name,

              mime,

              size:
                file.size,

              url,

              sender:
                "me",

              time,
            },
          ]
        );
      } catch {
        addSystem(
          "File could not be sent."
        );
      }
    };

  /*
   * ======================================================
   * SHARE LINK
   * ======================================================
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
   * ======================================================
   * COPY LINK
   * ======================================================
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

        setCopied(
          true
        );

        setTimeout(
          () =>
            setCopied(
              false
            ),
          1500
        );
      } catch {
        setCopied(
          false
        );
      }
    };

  /*
   * ======================================================
   * COPY PIN
   * ======================================================
   */

  const copyPin =
    async () => {
      if (!pin) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          pin
        );

        setCopiedPin(
          true
        );

        setTimeout(
          () =>
            setCopiedPin(
              false
            ),
          1500
        );
      } catch {
        setCopiedPin(
          false
        );
      }
    };

  /*
   * ======================================================
   * LEAVE ROOM
   * ======================================================
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

      pinRef.current =
        "";

      roleRef.current =
        null;

      revokeObjectUrls();

      setMode(
        "choose"
      );

      setRoomId("");

      setHostPeerId("");

      setPin("");

      setJoinPin("");

      setJoinRoom("");

      setConnected(
        false
      );

      setConnecting(
        false
      );

      setDraft("");

      setMessages([]);

      setFiles([]);

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
   * ======================================================
   * COMPONENT CLEANUP
   * ======================================================
   */

  useEffect(() => {
    return () => {
      clearTimers();

      connectionRef.current?.close();

      peerRef.current?.destroy();

      revokeObjectUrls();
    };
  }, [
    clearTimers,
    revokeObjectUrls,
  ]);

  /*
   * ======================================================
   * HOME / CREATE ROOM
   * ======================================================
   */

  if (
    mode ===
    "choose"
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
              PRIVATE PEER-TO-PEER CHAT
            </div>

            <h1>
              Talk privately.
              <br />

              <em>
                Directly.
              </em>
            </h1>

            <p>
              Create a temporary private room,
              choose a 4–6 digit PIN and share
              the invitation link.
            </p>

          </div>

          <div
            style={{
              width:
                "min(760px, 100%)",
              marginBottom:
                "14px",
            }}
          >

            <label
              style={{
                display:
                  "block",
                marginBottom:
                  "8px",
                fontSize:
                  "9px",
                letterSpacing:
                  ".18em",
                fontWeight:
                  700,
                color:
                  "#77736c",
              }}
            >
              CREATE ROOM PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(
                event
              ) => {
                const value =
                  event.target.value.replace(
                    /\D/g,
                    ""
                  );

                setPin(
                  value.slice(
                    0,
                    6
                  )
                );
              }}
              placeholder="4–6 digit PIN"
              autoComplete="new-password"
              style={{
                width:
                  "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #cfcbc4",
                background:
                  "#ffffff",
                padding:
                  "14px 15px",
                outline:
                  "none",
                fontSize:
                  "18px",
                letterSpacing:
                  ".25em",
              }}
            />

          </div>

          <div className="p2p-choice-grid">

            <button
              className="p2p-choice"
              onClick={
                createRoom
              }
              disabled={
                !/^\d{4,6}$/.test(
                  pin
                )
              }
            >
              <span className="p2p-choice-number">
                01
              </span>

              <strong>
                Create a room
              </strong>

              <small>
                Create a private room protected
                by your own PIN.
              </small>
            </button>

            <button
              className="p2p-choice"
              onClick={() =>
                setMode(
                  "join"
                )
              }
            >
              <span className="p2p-choice-number">
                02
              </span>

              <strong>
                Join a room
              </strong>

              <small>
                Open an invitation and enter
                the room PIN.
              </small>
            </button>

          </div>

          <div className="p2p-note">
            <span>●</span>
            No account required ·
            No chat history stored by WHOLEGACY
          </div>

        </div>
      </main>
    );
  }

  /*
   * ======================================================
   * USER 2 PIN KEYPAD
   * ======================================================
   */

  if (
    mode ===
      "join" &&
    !connected
  ) {
    const lastSystemMessage =
      messages
        .filter(
          (message) =>
            message.sender ===
            "system"
        )
        .slice(-1)[0];

    return (
      <main className="p2p-page">
        <div className="p2p-pin-page">

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

          <div className="p2p-pin-box">

            <div className="p2p-kicker">
              PRIVATE ROOM
            </div>

            <h1>
              Enter PIN
            </h1>

            <p>
              Enter the PIN shared by
              the room creator.
            </p>

            <div className="p2p-pin-dots">

              {Array.from({
                length:
                  Math.max(
                    4,
                    joinPin.length
                  ),
              }).map(
                (
                  _,
                  index
                ) => (
                  <span
                    key={
                      index
                    }
                    className={
                      index <
                      joinPin.length
                        ? "filled"
                        : ""
                    }
                  />
                )
              )}

            </div>

            <div className="p2p-keypad">

              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ].map(
                (
                  number
                ) => (
                  <button
                    type="button"
                    key={
                      number
                    }
                    onClick={() =>
                      pressPin(
                        number
                      )
                    }
                    disabled={
                      connecting
                    }
                  >
                    {number}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={
                  deletePin
                }
                disabled={
                  connecting ||
                  joinPin.length ===
                    0
                }
                aria-label="Delete PIN digit"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() =>
                  pressPin(
                    "0"
                  )
                }
                disabled={
                  connecting
                }
              >
                0
              </button>

              <button
                type="button"
                className="p2p-pin-enter"
                onClick={
                  joinRoomNow
                }
                disabled={
                  connecting ||
                  joinPin.length <
                    4 ||
                  !hostPeerId ||
                  !joinRoom
                }
                aria-label="Enter private room"
              >
                →
              </button>

            </div>

            {connecting && (
              <div className="p2p-pin-status">
                Connecting…
              </div>
            )}

            {!hostPeerId && (
              <div className="p2p-pin-status">
                Open the complete invitation
                link from the room creator.
              </div>
            )}

            {!connecting &&
              lastSystemMessage && (
                <div className="p2p-pin-status">
                  {
                    lastSystemMessage.text
                  }
                </div>
              )}

            <button
              type="button"
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
   * ======================================================
   * CHAT SCREEN
   * ======================================================
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
                {
                  roomId ||
                  joinRoom
                }
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

        {mode ===
          "host" && (
          <section className="p2p-invite">

            <div>

              <span>
                INVITE
              </span>

              <strong>
                Share this link + PIN
              </strong>

              <code>
                {shareUrl ||
                  "Generating peer address…"}
              </code>

            </div>

            <div className="p2p-invite-actions">

              <div className="p2p-password">

                <small>
                  PIN
                </small>

                <b>
                  {pin}
                </b>

              </div>

              <button
                type="button"
                onClick={
                  copyPin
                }
              >
                {copiedPin
                  ? "PIN copied ✓"
                  : "Copy PIN"}
              </button>

              <button
                type="button"
                onClick={
                  copyInvite
                }
                disabled={
                  !shareUrl
                }
              >
                {copied
                  ? "Link copied ✓"
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
            0 &&
            files.length ===
              0 && (
              <div className="p2p-empty">

                <span>
                  ∞
                </span>

                <strong>
                  Your private conversation
                  starts here.
                </strong>

                <small>
                  Browser-to-browser private
                  connection.
                </small>

              </div>
            )}

          {messages.map(
            (
              message
            ) => {
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

          {files.map(
            (
              file
            ) => (
              <div
                className={`p2p-message ${file.sender}`}
                key={
                  file.id
                }
              >

                <div className="p2p-file-card">

                  {file.mime.startsWith(
                    "image/"
                  ) ? (
                    <>

                      <img
                        src={
                          file.url
                        }
                        alt={
                          file.name
                        }
                        className="p2p-chat-image"
                        style={{
                          display:
                            "block",
                          width:
                            "min(320px, 100%)",
                          maxHeight:
                            "420px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "4px",
                        }}
                      />

                      <a
                        href={
                          file.url
                        }
                        download={
                          file.name
                        }
                      >
                        Download photo
                      </a>

                    </>
                  ) : (
                    <>

                      <strong>
                        {
                          file.name
                        }
                      </strong>

                      <small>
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{" "}
                        MB
                      </small>

                      <a
                        href={
                          file.url
                        }
                        download={
                          file.name
                        }
                      >
                        Download file
                      </a>

                    </>
                  )}

                </div>

                <time>
                  {
                    file.time
                  }
                </time>

              </div>
            )
          )}

        </section>

        <input
          ref={
            fileInputRef
          }
          type="file"
          hidden
          onChange={(
            event
          ) => {
            const file =
              event.target.files?.[0];

            if (file) {
              sendFile(
                file
              );
            }

            event.currentTarget.value =
              "";
          }}
        />

        <input
          ref={
            cameraInputRef
          }
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(
            event
          ) => {
            const file =
              event.target.files?.[0];

            if (file) {
              sendFile(
                file
              );
            }

            event.currentTarget.value =
              "";
          }}
        />

        <form
          className="p2p-composer"
          onSubmit={(
            event
          ) => {
            event.preventDefault();

            sendMessage();
          }}
        >

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={
              !connected
            }
            title="Attach file"
            style={{
              minWidth:
                "42px",
              border:
                "1px solid #cfcbc4",
              background:
                "#f3f1ec",
              color:
                "#37342f",
              cursor:
                connected
                  ? "pointer"
                  : "not-allowed",
              opacity:
                connected
                  ? 1
                  : 0.35,
            }}
          >
            +
          </button>

          <button
            type="button"
            onClick={() =>
              cameraInputRef.current?.click()
            }
            disabled={
              !connected
            }
            title="Take photo"
            style={{
              border:
                "1px solid #cfcbc4",
              background:
                "#f3f1ec",
              color:
                "#37342f",
              padding:
                "0 14px",
              cursor:
                connected
                  ? "pointer"
                  : "not-allowed",
              opacity:
                connected
                  ? 1
                  : 0.35,
            }}
          >
            Camera
          </button>

          <input
            value={
              draft
            }
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
