"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./page.module.css";

import type Peer from "peerjs";
import type { DataConnection } from "peerjs";

type Mode =
  | "choose"
  | "host"
  | "join";

type Transport =
  | "none"
  | "p2p"
  | "relay";

type ChatMessage = {
  id: string;
  sender:
    | "me"
    | "peer"
    | "system";
  text: string;
  time: string;
};

type SharedFile = {
  id: string;
  name: string;
  mime: string;
  size: number;
  url: string;
  sender:
    | "me"
    | "peer";
  time: string;
};

type RelayPayload =
  | {
      type: "control";
      action:
        | "relay-hello"
        | "relay-ack";
      from: string;
    }
  | {
      type: "chat";
      id: string;
      text: string;
      time: string;
    }
  | {
      type: "file-meta";
      fileId: string;
      name: string;
      mime: string;
      size: number;
      totalChunks: number;
      time: string;
    }
  | {
      type: "file-chunk";
      fileId: string;
      index: number;
      totalChunks: number;
      data: string;
    };

type IncomingFileState = {
  name: string;
  mime: string;
  size: number;
  totalChunks: number;
  time: string;

  chunks: Map<
    number,
    Uint8Array
  >;
};

const ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const MAX_FILE_SIZE =
  10 * 1024 * 1024;

const FILE_CHUNK_BYTES =
  128 * 1024;

const P2P_TIMEOUT_MS =
  12000;

const RELAY_POLL_MS =
  1200;

const PEER_OPTIONS = {
  debug: 1,

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
    ],
  },
};

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function randomString(
  length: number
) {
  const bytes =
    new Uint8Array(length);

  crypto.getRandomValues(
    bytes
  );

  return Array.from(
    bytes,
    (byte) =>
      ALPHABET[
        byte %
          ALPHABET.length
      ]
  ).join("");
}

function randomToken(
  bytesLength = 32
) {
  const bytes =
    new Uint8Array(
      bytesLength
    );

  crypto.getRandomValues(
    bytes
  );

  return bytesToBase64Url(
    bytes
  );
}

function getTime() {
  return new Date().toLocaleTimeString(
    [],
    {
      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}

/*
 * Uint8Array -> base64
 */

function bytesToBase64(
  bytes: Uint8Array
) {
  let binary =
    "";

  const step =
    0x8000;

  for (
    let i = 0;
    i < bytes.length;
    i += step
  ) {
    binary +=
      String.fromCharCode(
        ...bytes.subarray(
          i,
          i + step
        )
      );
  }

  return btoa(
    binary
  );
}

/*
 * base64 -> Uint8Array
 */

function base64ToBytes(
  value: string
) {
  const binary =
    atob(value);

  const bytes =
    new Uint8Array(
      binary.length
    );

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {
    bytes[i] =
      binary.charCodeAt(
        i
      );
  }

  return bytes;
}

function bytesToBase64Url(
  bytes: Uint8Array
) {
  return bytesToBase64(
    bytes
  )
    .replace(
      /\+/g,
      "-"
    )
    .replace(
      /\//g,
      "_"
    )
    .replace(
      /=+$/g,
      ""
    );
}

function base64UrlToBytes(
  value: string
) {
  const normalized =
    value
      .replace(
        /-/g,
        "+"
      )
      .replace(
        /_/g,
        "/"
      );

  const padded =
    normalized +
    "=".repeat(
      (
        4 -
        (
          normalized.length %
          4
        )
      ) %
        4
    );

  return base64ToBytes(
    padded
  );
}

/*
 * =========================================================
 * CRYPTO
 * =========================================================
 */

async function deriveRoomKey(
  roomId: string,
  secret: string,
  pin: string
) {
  const secretBytes =
    base64UrlToBytes(
      secret
    );

  /*
   * Convert explicitly to ArrayBuffer
   * for strict Next.js / TypeScript DOM typings.
   */

  const secretBuffer =
    secretBytes.buffer.slice(
      secretBytes.byteOffset,
      secretBytes.byteOffset +
        secretBytes.byteLength
    ) as ArrayBuffer;

  const material =
    await crypto.subtle.importKey(
      "raw",
      secretBuffer,
      "HKDF",
      false,
      [
        "deriveKey",
      ]
    );

  const salt =
    await crypto.subtle.digest(
      "SHA-256",

      new TextEncoder().encode(
        roomId
      )
    );

  return crypto.subtle.deriveKey(
    {
      name:
        "HKDF",

      hash:
        "SHA-256",

      salt,

      info:
        new TextEncoder().encode(
          `wholegacy-webchat-v1|pin:${pin}`
        ),
    },

    material,

    {
      name:
        "AES-GCM",

      length:
        256,
    },

    false,

    [
      "encrypt",
      "decrypt",
    ]
  );
}

async function encryptJson(
  key: CryptoKey,
  value: unknown
) {
  const iv =
    crypto.getRandomValues(
      new Uint8Array(
        12
      )
    );

  const plaintext =
    new TextEncoder().encode(
      JSON.stringify(
        value
      )
    );

  const plaintextBuffer =
    plaintext.buffer.slice(
      plaintext.byteOffset,
      plaintext.byteOffset +
        plaintext.byteLength
    ) as ArrayBuffer;

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name:
          "AES-GCM",

        iv,
      },

      key,

      plaintextBuffer
    );

  return {
    iv:
      bytesToBase64Url(
        iv
      ),

    ciphertext:
      bytesToBase64Url(
        new Uint8Array(
          encrypted
        )
      ),
  };
}

async function decryptJson<T>(
  key: CryptoKey,
  iv: string,
  ciphertext: string
): Promise<T> {
  const ivBytes =
    base64UrlToBytes(
      iv
    );

  const ciphertextBytes =
    base64UrlToBytes(
      ciphertext
    );

  const ivBuffer =
    ivBytes.buffer.slice(
      ivBytes.byteOffset,
      ivBytes.byteOffset +
        ivBytes.byteLength
    ) as ArrayBuffer;

  const cipherBuffer =
    ciphertextBytes.buffer.slice(
      ciphertextBytes.byteOffset,
      ciphertextBytes.byteOffset +
        ciphertextBytes.byteLength
    ) as ArrayBuffer;

  const decrypted =
    await crypto.subtle.decrypt(
      {
        name:
          "AES-GCM",

        iv:
          new Uint8Array(
            ivBuffer
          ),
      },

      key,

      cipherBuffer
    );

  return JSON.parse(
    new TextDecoder().decode(
      new Uint8Array(
        decrypted
      )
    )
  ) as T;
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function WebChatPage() {
  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [
    mode,
    setMode,
  ] =
    useState<Mode>(
      "choose"
    );

  const [
    transport,
    setTransport,
  ] =
    useState<Transport>(
      "none"
    );

  const [
    roomId,
    setRoomId,
  ] =
    useState("");

  const [
    hostPeerId,
    setHostPeerId,
  ] =
    useState("");

  const [
    pin,
    setPin,
  ] =
    useState("");

  const [
    joinPin,
    setJoinPin,
  ] =
    useState("");

  const [
    joinRoom,
    setJoinRoom,
  ] =
    useState("");

  const [
    connected,
    setConnected,
  ] =
    useState(false);

  const [
    connecting,
    setConnecting,
  ] =
    useState(false);

  const [
    draft,
    setDraft,
  ] =
    useState("");

  const [
    copied,
    setCopied,
  ] =
    useState(false);

  const [
    copiedPin,
    setCopiedPin,
  ] =
    useState(false);

  const [
    messages,
    setMessages,
  ] =
    useState<
      ChatMessage[]
    >([]);

  const [
    files,
    setFiles,
  ] =
    useState<
      SharedFile[]
    >([]);

  /*
   * =======================================================
   * REFS
   * =======================================================
   */

  const peerRef =
    useRef<
      Peer | null
    >(null);

  const connectionRef =
    useRef<
      DataConnection | null
    >(null);

  const roomIdRef =
    useRef("");

  const pinRef =
    useRef("");

  const roomSecretRef =
    useRef("");

  const relayTokenRef =
    useRef("");

  const cryptoKeyRef =
    useRef<
      CryptoKey | null
    >(null);

  const transportRef =
    useRef<Transport>(
      "none"
    );

  const clientIdRef =
    useRef(
      crypto.randomUUID()
    );

  const relayCursorRef =
    useRef(0);

  const pollTimerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  const pollEnabledRef =
    useRef(false);

  const p2pTimeoutRef =
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

  const relayHandshakeTimeoutRef =
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

  const objectUrlsRef =
    useRef<
      string[]
    >([]);

  const incomingFilesRef =
    useRef<
      Map<
        string,
        IncomingFileState
      >
    >(
      new Map()
    );

  /*
   * =======================================================
   * SET TRANSPORT
   * =======================================================
   */

  const setTransportMode =
    useCallback(
      (
        value: Transport
      ) => {
        transportRef.current =
          value;

        setTransport(
          value
        );
      },
      []
    );

  /*
   * =======================================================
   * SYSTEM MESSAGE
   * =======================================================
   */

  const addSystem =
    useCallback(
      (
        text: string
      ) => {
        setMessages(
          (
            current
          ) => [
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
   * =======================================================
   * CLEAR CONNECTION TIMERS
   * =======================================================
   */

  const clearConnectionTimers =
    useCallback(
      () => {
        if (
          p2pTimeoutRef.current
        ) {
          clearTimeout(
            p2pTimeoutRef.current
          );

          p2pTimeoutRef.current =
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

        if (
          relayHandshakeTimeoutRef.current
        ) {
          clearTimeout(
            relayHandshakeTimeoutRef.current
          );

          relayHandshakeTimeoutRef.current =
            null;
        }
      },
      []
    );

  /*
   * =======================================================
   * STOP RELAY POLLING
   * =======================================================
   */

  const stopRelayPolling =
    useCallback(
      () => {
        pollEnabledRef.current =
          false;

        if (
          pollTimerRef.current
        ) {
          clearTimeout(
            pollTimerRef.current
          );

          pollTimerRef.current =
            null;
        }
      },
      []
    );

  /*
   * =======================================================
   * OBJECT URL CLEANUP
   * =======================================================
   */

  const revokeObjectUrls =
    useCallback(
      () => {
        objectUrlsRef.current.forEach(
          (
            url
          ) => {
            URL.revokeObjectURL(
              url
            );
          }
        );

        objectUrlsRef.current =
          [];
      },
      []
    );

  /*
   * =======================================================
   * READ INVITATION
   * =======================================================
   */

  const invitation =
    useMemo(
      () => {
        if (
          typeof window ===
          "undefined"
        ) {
          return null;
        }

        const query =
          new URLSearchParams(
            window.location.search
          );

        const hash =
          new URLSearchParams(
            window.location.hash.replace(
              /^#/,
              ""
            )
          );

        return {
          room:
            (
              query.get(
                "room"
              ) || ""
            ).toUpperCase(),

          peer:
            query.get(
              "peer"
            ) || "",

          secret:
            hash.get(
              "s"
            ) || "",

          token:
            hash.get(
              "t"
            ) || "",
        };
      },
      []
    );

  useEffect(
    () => {
      if (
        invitation?.room &&
        invitation?.secret &&
        invitation?.token
      ) {
        setJoinRoom(
          invitation.room
        );

        setHostPeerId(
          invitation.peer
        );

        roomSecretRef.current =
          invitation.secret;

        relayTokenRef.current =
          invitation.token;

        setMode(
          "join"
        );
      }
    },
    [
      invitation,
    ]
  );

  /*
   * =======================================================
   * FINISH INCOMING FILE
   *
   * FIXED FOR NEXT.JS 16 / TS BlobPart typing
   * =======================================================
   */

  const finishIncomingFile =
    useCallback(
      (
        fileId: string
      ) => {
        const state =
          incomingFilesRef.current.get(
            fileId
          );

        if (
          !state ||
          state.chunks.size !==
            state.totalChunks
        ) {
          return;
        }

        /*
         * IMPORTANT:
         *
         * Do NOT pass Uint8Array<ArrayBufferLike>[]
         * directly into new Blob().
         *
         * Next.js 16 / newer TS DOM typings require
         * ArrayBuffer-compatible BlobPart values.
         */

        const ordered:
          BlobPart[] =
          [];

        for (
          let i = 0;
          i <
          state.totalChunks;
          i++
        ) {
          const chunk =
            state.chunks.get(
              i
            );

          if (!chunk) {
            return;
          }

          const buffer =
            chunk.buffer.slice(
              chunk.byteOffset,

              chunk.byteOffset +
                chunk.byteLength
            ) as ArrayBuffer;

          ordered.push(
            buffer
          );
        }

        const blob =
          new Blob(
            ordered,
            {
              type:
                state.mime,
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
          (
            current
          ) => [
            ...current,

            {
              id:
                fileId,

              name:
                state.name,

              mime:
                state.mime,

              size:
                state.size,

              url,

              sender:
                "peer",

              time:
                state.time,
            },
          ]
        );

        incomingFilesRef.current.delete(
          fileId
        );
      },
      []
    );

  /*
   * =======================================================
   * SEND RELAY PAYLOAD
   * =======================================================
   */

  const sendRelayPayload =
    useCallback(
      async (
        payload: RelayPayload
      ) => {
        const key =
          cryptoKeyRef.current;

        const room =
          roomIdRef.current;

        const token =
          relayTokenRef.current;

        if (
          !key ||
          !room ||
          !token
        ) {
          throw new Error(
            "Relay encryption is not ready."
          );
        }

        const encrypted =
          await encryptJson(
            key,
            payload
          );

        const response =
          await fetch(
            "/api/webchat/messages",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    roomId:
                      room,

                    token,

                    senderId:
                      clientIdRef.current,

                    messageId:
                      crypto.randomUUID(),

                    iv:
                      encrypted.iv,

                    ciphertext:
                      encrypted.ciphertext,
                  }
                ),
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            "Relay send failed."
          );
        }
      },
      []
    );

  /*
   * =======================================================
   * HANDLE PAYLOAD
   * =======================================================
   */

  const handlePayload =
    useCallback(
      async (
        payload:
          RelayPayload,

        via:
          | "p2p"
          | "relay"
      ) => {
        /*
         * CONTROL
         */

        if (
          payload.type ===
          "control"
        ) {
          if (
            via !==
              "relay" ||
            payload.from ===
              clientIdRef.current
          ) {
            return;
          }

          /*
           * Relay hello
           */

          if (
            payload.action ===
            "relay-hello"
          ) {
            setTransportMode(
              "relay"
            );

            setConnected(
              true
            );

            setConnecting(
              false
            );

            if (
              relayHandshakeTimeoutRef.current
            ) {
              clearTimeout(
                relayHandshakeTimeoutRef.current
              );

              relayHandshakeTimeoutRef.current =
                null;
            }

            connectionRef.current?.close();

            connectionRef.current =
              null;

            try {
              await sendRelayPayload(
                {
                  type:
                    "control",

                  action:
                    "relay-ack",

                  from:
                    clientIdRef.current,
                }
              );
            } catch {
              /*
               * Next relay request
               * will surface an error.
               */
            }

            addSystem(
              "Connected through encrypted temporary relay."
            );

            return;
          }

          /*
           * Relay ACK
           */

          if (
            payload.action ===
            "relay-ack"
          ) {
            setTransportMode(
              "relay"
            );

            setConnected(
              true
            );

            setConnecting(
              false
            );

            if (
              relayHandshakeTimeoutRef.current
            ) {
              clearTimeout(
                relayHandshakeTimeoutRef.current
              );

              relayHandshakeTimeoutRef.current =
                null;
            }

            connectionRef.current?.close();

            connectionRef.current =
              null;

            addSystem(
              "Connected through encrypted temporary relay."
            );
          }

          return;
        }

        /*
         * CHAT
         */

        if (
          payload.type ===
          "chat"
        ) {
          setMessages(
            (
              current
            ) => [
              ...current,

              {
                id:
                  payload.id,

                sender:
                  "peer",

                text:
                  payload.text,

                time:
                  payload.time,
              },
            ]
          );

          return;
        }

        /*
         * FILE META
         */

        if (
          payload.type ===
          "file-meta"
        ) {
          incomingFilesRef.current.set(
            payload.fileId,

            {
              name:
                payload.name,

              mime:
                payload.mime,

              size:
                payload.size,

              totalChunks:
                payload.totalChunks,

              time:
                payload.time,

              chunks:
                new Map(),
            }
          );

          return;
        }

        /*
         * FILE CHUNK
         */

        if (
          payload.type ===
          "file-chunk"
        ) {
          const state =
            incomingFilesRef.current.get(
              payload.fileId
            );

          if (!state) {
            return;
          }

          state.chunks.set(
            payload.index,

            base64ToBytes(
              payload.data
            )
          );

          finishIncomingFile(
            payload.fileId
          );
        }
      },
      [
        addSystem,
        finishIncomingFile,
        sendRelayPayload,
        setTransportMode,
      ]
    );

  /*
   * =======================================================
   * RELAY POLLING
   * =======================================================
   */

  const startRelayPolling =
    useCallback(
      () => {
        stopRelayPolling();

        pollEnabledRef.current =
          true;

        const tick =
          async () => {
            if (
              !pollEnabledRef.current
            ) {
              return;
            }

            try {
              const room =
                roomIdRef.current;

              const token =
                relayTokenRef.current;

              if (
                !room ||
                !token ||
                !cryptoKeyRef.current
              ) {
                return;
              }

              const response =
                await fetch(
                  `/api/webchat/messages?room=${encodeURIComponent(
                    room
                  )}&token=${encodeURIComponent(
                    token
                  )}&after=${relayCursorRef.current}`,
                  {
                    cache:
                      "no-store",
                  }
                );

              if (
                response.ok
              ) {
                const data =
                  (await response.json()) as {
                    messages:
                      Array<{
                        seq:
                          number;

                        senderId:
                          string;

                        iv:
                          string;

                        ciphertext:
                          string;
                      }>;
                  };

                for (
                  const item of
                  data.messages
                ) {
                  relayCursorRef.current =
                    Math.max(
                      relayCursorRef.current,
                      item.seq
                    );

                  if (
                    item.senderId ===
                    clientIdRef.current
                  ) {
                    continue;
                  }

                  try {
                    const payload =
                      await decryptJson<RelayPayload>(
                        cryptoKeyRef.current!,

                        item.iv,

                        item.ciphertext
                      );

                    await handlePayload(
                      payload,
                      "relay"
                    );
                  } catch {
                    /*
                     * Invalid ciphertext
                     * is ignored.
                     */
                  }
                }
              }
            } finally {
              if (
                pollEnabledRef.current
              ) {
                pollTimerRef.current =
                  setTimeout(
                    tick,
                    RELAY_POLL_MS
                  );
              }
            }
          };

        void tick();
      },
      [
        handlePayload,
        stopRelayPolling,
      ]
    );

  /*
   * =======================================================
   * ACTIVATE RELAY
   * =======================================================
   */

  const activateRelay =
    useCallback(
      async () => {
        if (
          transportRef.current ===
          "relay"
        ) {
          return;
        }

        clearConnectionTimers();

        setTransportMode(
          "relay"
        );

        setConnecting(
          true
        );

        setConnected(
          false
        );

        connectionRef.current?.close();

        connectionRef.current =
          null;

        try {
          await sendRelayPayload(
            {
              type:
                "control",

              action:
                "relay-hello",

              from:
                clientIdRef.current,
            }
          );

          relayHandshakeTimeoutRef.current =
            setTimeout(
              () => {
                if (
                  transportRef.current ===
                  "relay"
                ) {
                  setConnecting(
                    false
                  );

                  addSystem(
                    "Encrypted relay is ready. Waiting for the other participant."
                  );
                }
              },
              10000
            );
        } catch {
          setConnecting(
            false
          );

          addSystem(
            "Encrypted relay could not be reached."
          );
        }
      },
      [
        addSystem,
        clearConnectionTimers,
        sendRelayPayload,
        setTransportMode,
      ]
    );

  /*
   * =======================================================
   * ATTACH P2P CONNECTION
   * =======================================================
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
        if (
          transportRef.current ===
          "relay"
        ) {
          connection.close();

          return;
        }

        connectionRef.current =
          connection;

        /*
         * Direct P2P timeout.
         */

        p2pTimeoutRef.current =
          setTimeout(
            () => {
              if (
                !connection.open &&
                transportRef.current !==
                  "relay"
              ) {
                connection.close();

                void activateRelay();
              }
            },
            P2P_TIMEOUT_MS
          );

        /*
         * P2P open.
         */

        connection.on(
          "open",
          () => {
            if (
              p2pTimeoutRef.current
            ) {
              clearTimeout(
                p2pTimeoutRef.current
              );

              p2pTimeoutRef.current =
                null;
            }

            /*
             * Guest authenticates PIN.
             */

            if (
              role ===
              "guest"
            ) {
              connection.send(
                {
                  type:
                    "auth",

                  room:
                    guestRoom?.toUpperCase() ||
                    "",

                  pin:
                    guestPin ||
                    "",
                }
              );

              authTimeoutRef.current =
                setTimeout(
                  () => {
                    if (
                      transportRef.current !==
                      "relay"
                    ) {
                      void activateRelay();
                    }
                  },
                  8000
                );
            }
          }
        );

        /*
         * Receive P2P data.
         */

        connection.on(
          "data",
          (
            raw
          ) => {
            const data =
              raw as any;

            /*
             * HOST AUTH
             */

            if (
              role ===
                "host" &&
              data?.type ===
                "auth"
            ) {
              const valid =
                String(
                  data.room ||
                    ""
                ).toUpperCase() ===
                  roomIdRef.current &&
                String(
                  data.pin ||
                    ""
                ) ===
                  pinRef.current;

              if (!valid) {
                connection.send(
                  {
                    type:
                      "auth-failed",
                  }
                );

                setTimeout(
                  () =>
                    connection.close(),
                  200
                );

                return;
              }

              connection.send(
                {
                  type:
                    "auth-ok",
                }
              );

              setTransportMode(
                "p2p"
              );

              setConnected(
                true
              );

              setConnecting(
                false
              );

              addSystem(
                "Direct peer-to-peer connection established."
              );

              return;
            }

            /*
             * GUEST AUTH OK
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

              setTransportMode(
                "p2p"
              );

              setRoomId(
                guestRoom ||
                  ""
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
                "PIN accepted. Direct peer-to-peer chat connected."
              );

              return;
            }

            /*
             * GUEST AUTH FAILED
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

              setConnecting(
                false
              );

              setConnected(
                false
              );

              setJoinPin(
                ""
              );

              addSystem(
                "Incorrect PIN."
              );

              connection.close();

              return;
            }

            /*
             * Chat/file payload over P2P.
             */

            if (
              data?.type ===
                "chat" ||
              data?.type ===
                "file-meta" ||
              data?.type ===
                "file-chunk"
            ) {
              void handlePayload(
                data as RelayPayload,
                "p2p"
              );
            }
          }
        );

        /*
         * P2P error -> relay fallback.
         */

        connection.on(
          "error",
          () => {
            if (
              transportRef.current !==
              "relay"
            ) {
              void activateRelay();
            }
          }
        );

        /*
         * P2P disconnected after
         * being connected -> relay fallback.
         */

        connection.on(
          "close",
          () => {
            if (
              connectionRef.current ===
              connection
            ) {
              connectionRef.current =
                null;
            }

            if (
              transportRef.current ===
              "p2p"
            ) {
              void activateRelay();
            }
          }
        );
      },
      [
        activateRelay,
        addSystem,
        handlePayload,
        setTransportMode,
      ]
    );

  /*
   * =======================================================
   * CREATE ROOM
   * =======================================================
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

      clearConnectionTimers();

      stopRelayPolling();

      peerRef.current?.destroy();

      peerRef.current =
        null;

      connectionRef.current =
        null;

      relayCursorRef.current =
        0;

      incomingFilesRef.current.clear();

      revokeObjectUrls();

      setMessages([]);

      setFiles([]);

      setConnected(
        false
      );

      setConnecting(
        true
      );

      setTransportMode(
        "none"
      );

      setHostPeerId(
        ""
      );

      const newRoom =
        randomString(
          8
        );

      const secret =
        randomToken(
          32
        );

      const relayToken =
        randomToken(
          32
        );

      roomIdRef.current =
        newRoom;

      pinRef.current =
        cleanPin;

      roomSecretRef.current =
        secret;

      relayTokenRef.current =
        relayToken;

      setRoomId(
        newRoom
      );

      setMode(
        "host"
      );

      try {
        /*
         * Create browser-side encryption key.
         */

        const key =
          await deriveRoomKey(
            newRoom,
            secret,
            cleanPin
          );

        cryptoKeyRef.current =
          key;

        /*
         * Encrypted PIN verifier.
         *
         * Server cannot read this plaintext.
         */

        const verifier =
          await encryptJson(
            key,
            {
              v:
                1,

              room:
                newRoom,

              marker:
                "WHOLEGACY_PRIVATE_ROOM",
            }
          );

        /*
         * Initialize temporary relay room.
         */

        const createResponse =
          await fetch(
            "/api/webchat/room",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  {
                    roomId:
                      newRoom,

                    token:
                      relayToken,

                    verifierIv:
                      verifier.iv,

                    verifierCiphertext:
                      verifier.ciphertext,
                  }
                ),
            }
          );

        if (
          !createResponse.ok
        ) {
          throw new Error(
            "Room relay initialization failed."
          );
        }

        /*
         * Host listens to relay from the start.
         */

        startRelayPolling();

        /*
         * Try direct P2P signaling.
         */

        try {
          const {
            default:
              PeerJS,
          } =
            await import(
              "peerjs"
            );

          const peer =
            new PeerJS(
              PEER_OPTIONS
            );

          peerRef.current =
            peer;

          peer.on(
            "connection",
            (
              connection:
                DataConnection
            ) => {
              if (
                transportRef.current ===
                "relay"
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

          peer.on(
            "open",
            (
              id
            ) => {
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
            () => {
              setConnecting(
                false
              );

              addSystem(
                "Direct P2P signaling is unavailable. Encrypted relay remains available."
              );
            }
          );
        } catch {
          setConnecting(
            false
          );

          addSystem(
            "Direct P2P is unavailable. Encrypted relay remains available."
          );
        }
      } catch {
        setConnecting(
          false
        );

        addSystem(
          "Unable to create the private room."
        );
      }
    };

  /*
   * =======================================================
   * VERIFY PIN + JOIN
   * =======================================================
   */

  const verifyPinAndJoin =
    async () => {
      const cleanRoom =
        joinRoom
          .trim()
          .toUpperCase();

      const cleanPin =
        joinPin.trim();

      const secret =
        roomSecretRef.current;

      const token =
        relayTokenRef.current;

      if (
        !cleanRoom ||
        !/^\d{4,6}$/.test(
          cleanPin
        ) ||
        !secret ||
        !token
      ) {
        return;
      }

      setConnecting(
        true
      );

      setConnected(
        false
      );

      setTransportMode(
        "none"
      );

      clearConnectionTimers();

      stopRelayPolling();

      relayCursorRef.current =
        0;

      try {
        /*
         * Derive candidate encryption key
         * from PIN + invite secret.
         */

        const key =
          await deriveRoomKey(
            cleanRoom,
            secret,
            cleanPin
          );

        /*
         * Read encrypted verifier.
         */

        const response =
          await fetch(
            `/api/webchat/room?room=${encodeURIComponent(
              cleanRoom
            )}&token=${encodeURIComponent(
              token
            )}`,
            {
              cache:
                "no-store",
            }
          );

        if (
          !response.ok
        ) {
          setConnecting(
            false
          );

          addSystem(
            "This private room is no longer available."
          );

          return;
        }

        const roomData =
          (await response.json()) as {
            verifierIv:
              string;

            verifierCiphertext:
              string;
          };

        /*
         * Wrong PIN cannot decrypt verifier.
         */

        try {
          const verifier =
            await decryptJson<{
              v:
                number;

              room:
                string;

              marker:
                string;
            }>(
              key,

              roomData.verifierIv,

              roomData.verifierCiphertext
            );

          if (
            verifier.room !==
              cleanRoom ||
            verifier.marker !==
              "WHOLEGACY_PRIVATE_ROOM"
          ) {
            throw new Error(
              "Invalid verifier"
            );
          }
        } catch {
          setConnecting(
            false
          );

          setJoinPin(
            ""
          );

          addSystem(
            "Incorrect PIN."
          );

          return;
        }

        /*
         * PIN verified locally.
         */

        cryptoKeyRef.current =
          key;

        roomIdRef.current =
          cleanRoom;

        pinRef.current =
          cleanPin;

        setRoomId(
          cleanRoom
        );

        /*
         * Begin relay polling immediately.
         */

        startRelayPolling();

        /*
         * If invitation has no P2P peer,
         * use relay immediately.
         */

        if (
          !hostPeerId
        ) {
          await activateRelay();

          return;
        }

        /*
         * Otherwise attempt direct WebRTC first.
         */

        try {
          const {
            default:
              PeerJS,
          } =
            await import(
              "peerjs"
            );

          const peer =
            new PeerJS(
              PEER_OPTIONS
            );

          peerRef.current =
            peer;

          const peerOpenTimeout =
            setTimeout(
              () => {
                if (
                  !peer.open &&
                  transportRef.current !==
                    "relay"
                ) {
                  peer.destroy();

                  void activateRelay();
                }
              },
              8000
            );

          peer.on(
            "open",
            () => {
              clearTimeout(
                peerOpenTimeout
              );

              const connection =
                peer.connect(
                  hostPeerId,
                  {
                    reliable:
                      true,
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
            () => {
              clearTimeout(
                peerOpenTimeout
              );

              if (
                transportRef.current !==
                "relay"
              ) {
                void activateRelay();
              }
            }
          );
        } catch {
          await activateRelay();
        }
      } catch {
        setConnecting(
          false
        );

        addSystem(
          "Unable to open this private room."
        );
      }
    };

  /*
   * =======================================================
   * SEND PAYLOAD
   * =======================================================
   */

  const sendPayload =
    useCallback(
      async (
        payload: RelayPayload
      ) => {
        /*
         * Direct P2P.
         */

        if (
          transportRef.current ===
          "p2p"
        ) {
          const connection =
            connectionRef.current;

          if (
            !connection?.open
          ) {
            await activateRelay();

            await sendRelayPayload(
              payload
            );

            return;
          }

          connection.send(
            payload
          );

          return;
        }

        /*
         * Encrypted relay.
         */

        if (
          transportRef.current ===
          "relay"
        ) {
          await sendRelayPayload(
            payload
          );

          return;
        }

        throw new Error(
          "No active transport."
        );
      },
      [
        activateRelay,
        sendRelayPayload,
      ]
    );

  /*
   * =======================================================
   * SEND TEXT
   * =======================================================
   */

  const sendMessage =
    async () => {
      const text =
        draft.trim();

      if (
        !text ||
        !connected
      ) {
        return;
      }

      const message:
        RelayPayload = {
        type:
          "chat",

        id:
          crypto.randomUUID(),

        text,

        time:
          getTime(),
      };

      try {
        await sendPayload(
          message
        );

        setMessages(
          (
            current
          ) => [
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
      } catch {
        addSystem(
          "Message could not be sent."
        );
      }
    };

  /*
   * =======================================================
   * SEND FILE
   * =======================================================
   */

  const sendFile =
    async (
      file: File
    ) => {
      if (
        !connected
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
        const id =
          crypto.randomUUID();

        const time =
          getTime();

        const mime =
          file.type ||
          "application/octet-stream";

        const fileBuffer =
          await file.arrayBuffer();

        const bytes =
          new Uint8Array(
            fileBuffer
          );

        const totalChunks =
          Math.ceil(
            bytes.length /
              FILE_CHUNK_BYTES
          );

        /*
         * File metadata.
         */

        await sendPayload(
          {
            type:
              "file-meta",

            fileId:
              id,

            name:
              file.name,

            mime,

            size:
              file.size,

            totalChunks,

            time,
          }
        );

        /*
         * File chunks.
         */

        for (
          let index = 0;
          index <
          totalChunks;
          index++
        ) {
          const start =
            index *
            FILE_CHUNK_BYTES;

          const end =
            Math.min(
              bytes.length,

              start +
                FILE_CHUNK_BYTES
            );

          const chunk =
            bytes.subarray(
              start,
              end
            );

          await sendPayload(
            {
              type:
                "file-chunk",

              fileId:
                id,

              index,

              totalChunks,

              data:
                bytesToBase64(
                  chunk
                ),
            }
          );
        }

        /*
         * Local preview.
         */

        const url =
          URL.createObjectURL(
            file
          );

        objectUrlsRef.current.push(
          url
        );

        setFiles(
          (
            current
          ) => [
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
   * =======================================================
   * PIN KEYPAD
   * =======================================================
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
        (
          current
        ) => {
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
        (
          current
        ) =>
          current.slice(
            0,
            -1
          )
      );
    };

  /*
   * =======================================================
   * INVITE URL
   *
   * Secret + relay token live after #.
   * PIN is NEVER included.
   * =======================================================
   */

  const shareUrl =
    typeof window !==
      "undefined" &&
    roomId &&
    roomSecretRef.current &&
    relayTokenRef.current
      ? `${
          window.location.origin
        }/webchat?room=${encodeURIComponent(
          roomId
        )}${
          hostPeerId
            ? `&peer=${encodeURIComponent(
                hostPeerId
              )}`
            : ""
        }#s=${encodeURIComponent(
          roomSecretRef.current
        )}&t=${encodeURIComponent(
          relayTokenRef.current
        )}`
      : "";

  /*
   * =======================================================
   * COPY INVITE
   * =======================================================
   */

  const copyInvite =
    async () => {
      if (
        !shareUrl
      ) {
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
   * =======================================================
   * COPY PIN
   * =======================================================
   */

  const copyPin =
    async () => {
      if (
        !pin
      ) {
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
   * =======================================================
   * LEAVE
   * =======================================================
   */

  const leave =
    () => {
      const currentRoom =
        roomIdRef.current;

      const currentToken =
        relayTokenRef.current;

      clearConnectionTimers();

      stopRelayPolling();

      connectionRef.current?.close();

      peerRef.current?.destroy();

      revokeObjectUrls();

      /*
       * Host destroys temporary relay room.
       */

      if (
        mode ===
          "host" &&
        currentRoom &&
        currentToken
      ) {
        fetch(
          "/api/webchat/room",
          {
            method:
              "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  roomId:
                    currentRoom,

                  token:
                    currentToken,
                }
              ),
          }
        ).catch(
          () =>
            undefined
        );
      }

      peerRef.current =
        null;

      connectionRef.current =
        null;

      roomIdRef.current =
        "";

      pinRef.current =
        "";

      roomSecretRef.current =
        "";

      relayTokenRef.current =
        "";

      cryptoKeyRef.current =
        null;

      relayCursorRef.current =
        0;

      incomingFilesRef.current.clear();

      setMode(
        "choose"
      );

      setTransportMode(
        "none"
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
   * =======================================================
   * UNMOUNT CLEANUP
   * =======================================================
   */

  useEffect(
    () => {
      return () => {
        clearConnectionTimers();

        stopRelayPolling();

        connectionRef.current?.close();

        peerRef.current?.destroy();

        revokeObjectUrls();
      };
    },
    [
      clearConnectionTimers,
      revokeObjectUrls,
      stopRelayPolling,
    ]
  );

  /*
   * =======================================================
   * HOME
   * =======================================================
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
              PRIVATE CHAT
            </div>

            <h1>
              Talk privately.
              <br />

              <em>
                Direct when possible.
              </em>
            </h1>

            <p>
              Create a temporary private room
              with your own 4–6 digit PIN.
              WHOLEGACY tries direct WebRTC
              first and automatically uses an
              encrypted temporary relay when
              required.
            </p>

          </div>

          <div className={styles.createPin}>

            <label>
              CREATE ROOM PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(event) => {
                const value =
                  event.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      6
                    );

                setPin(
                  value
                );
              }}
              placeholder="4–6 digit PIN"
              autoComplete="new-password"
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
                Create a temporary
                PIN-protected room.
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
                Use an invitation link
                and enter the PIN.
              </small>

            </button>

          </div>

          <div className="p2p-note">

            <span>
              ●
            </span>

            No account required ·
            Relay content encrypted
            in your browser

          </div>

        </div>

      </main>
    );
  }

  /*
   * =======================================================
   * JOIN / PIN KEYPAD
   * =======================================================
   */

  if (
    mode ===
      "join" &&
    !connected
  ) {
    const lastSystemMessage =
      messages
        .filter(
          (
            message
          ) =>
            message.sender ===
            "system"
        )
        .slice(
          -1
        )[0];

    return (
      <main className="p2p-page">

        <div className={styles.pinPage}>

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

          <div className={styles.pinBox}>

            <div className="p2p-kicker">
              PRIVATE ROOM
            </div>

            <h1>
              Enter PIN
            </h1>

            <p>
              Touch the PIN shared by
              the room creator.
            </p>

            <div className={styles.pinDots}>

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
                        ? styles.filled
                        : ""
                    }
                  />
                )
              )}

            </div>

            <div className={styles.keypad}>

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
                aria-label="Delete digit"
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
                className={
                  styles.enterButton
                }
                onClick={
                  verifyPinAndJoin
                }
                disabled={
                  connecting ||
                  joinPin.length <
                    4 ||
                  !joinRoom ||
                  !roomSecretRef.current ||
                  !relayTokenRef.current
                }
                aria-label="Enter private room"
              >
                →
              </button>

            </div>

            {connecting && (
              <div className={styles.pinStatus}>
                Connecting securely…
              </div>
            )}

            {!connecting &&
              lastSystemMessage && (
                <div className={styles.pinStatus}>
                  {
                    lastSystemMessage.text
                  }
                </div>
              )}

            {!roomSecretRef.current && (
              <div className={styles.pinStatus}>
                Open the complete invitation
                link from the room creator.
              </div>
            )}

            <button
              type="button"
              className="p2p-back"
              onClick={
                leave
              }
            >
              ← Back
            </button>

          </div>

        </div>

      </main>
    );
  }

  /*
   * =======================================================
   * CHAT SCREEN
   * =======================================================
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
                  ? transport ===
                    "p2p"
                    ? "DIRECT"
                    : "ENCRYPTED RELAY"
                  : connecting
                  ? "CONNECTING"
                  : "WAITING"}

              </span>

            </div>

          </div>

          <button
            className="p2p-leave"
            onClick={
              leave
            }
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
                  "Preparing private room…"}
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
                  Direct P2P when possible,
                  encrypted temporary relay
                  when required.
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

                <div className={styles.fileCard}>

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
                        className={
                          styles.chatImage
                        }
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
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (
              file
            ) {
              void sendFile(
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
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (
              file
            ) {
              void sendFile(
                file
              );
            }

            event.currentTarget.value =
              "";
          }}
        />

        <form
          className="p2p-composer"
          onSubmit={(event) => {
            event.preventDefault();

            void sendMessage();
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
          >
            Camera
          </button>

          <input
            value={
              draft
            }
            onChange={(event) =>
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
