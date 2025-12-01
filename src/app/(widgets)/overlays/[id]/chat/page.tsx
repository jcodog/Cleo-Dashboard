"use client";

import { use, useCallback, useEffect, useState } from "react";
import { SiKick, SiTwitch } from "react-icons/si";
import { io, type Socket } from "socket.io-client";

type IncomingChatMessage = {
  roomId: string;
  author: string;
  text: string;
  platform?: string;
  avatarUrl?: string;
};

type ChatMessage = IncomingChatMessage & { localId: string };

// Keep message count low so the vertical overlay never feels crowded.
const MAX_MESSAGES = 20;

const generateMessageId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
const KICK_AVATAR_PROXY_PATH = "/api/proxy/kick-avatar?url=";
const KICK_AVATAR_HOST = "files.kick.com";

const ChatOverlay = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const roomId = `overlay-chat-${id}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const resolveAvatarSrc = useCallback((message: IncomingChatMessage) => {
    if (!message.avatarUrl) return null;

    let hostname: string | null = null;
    try {
      hostname = new URL(message.avatarUrl).hostname;
    } catch {
      hostname = null;
    }

    if (hostname === KICK_AVATAR_HOST) {
      return `${KICK_AVATAR_PROXY_PATH}${encodeURIComponent(
        message.avatarUrl
      )}`;
    }

    return message.avatarUrl;
  }, []);

  useEffect(() => {
    const socket: Socket = io(socketUrl, {
      transports: ["websocket"],
      query: { roomId },
    });

    const handler = (msg: IncomingChatMessage) => {
      if (msg.roomId !== roomId) return;

      console.log(msg);

      setMessages((prev) => {
        const nextMessage = { ...msg, localId: generateMessageId() };
        const next = [...prev, nextMessage];
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next;
      });
    };

    socket.on("chat:message", handler);
    return () => {
      socket.off("chat:message", handler);
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="w-full h-full flex flex-col justify-end p-4 gap-2">
      {messages.map((m) => {
        const avatarSrc = resolveAvatarSrc(m);
        return (
          <div
            key={m.localId}
            className="rounded-xl bg-black/70 px-3 py-2 backdrop-blur flex gap-3 items-center chat-pop-in"
          >
            {m.platform === "kick" ? (
              <SiKick className="text-green-400 text-xl shrink-0" />
            ) : m.platform === "twitch" ? (
              <SiTwitch className="text-purple-400 text-xl shrink-0" />
            ) : null}

            {avatarSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarSrc}
                alt={m.author}
                className="size-8 rounded-full object-cover"
              />
            )}

            <div className="flex flex-col text-white">
              <span className="font-semibold text-sm">{m.author}</span>
              <span className="text-sm">{m.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatOverlay;
