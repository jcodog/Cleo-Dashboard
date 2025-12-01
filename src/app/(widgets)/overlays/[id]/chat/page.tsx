"use client";

import { use, useEffect, useState } from "react";
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

const MAX_MESSAGES = 50;

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

const ChatOverlay = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const roomId = `overlay-chat-${id}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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
      {messages.map((m) => (
        <div
          key={m.localId}
          className="rounded-xl bg-black/70 px-3 py-2 backdrop-blur flex gap-3 items-center chat-pop-in"
        >
          {m.platform === "kick" ? (
            <SiKick className="text-green-400 text-xl shrink-0" />
          ) : m.platform === "twitch" ? (
            <SiTwitch className="text-purple-400 text-xl shrink-0" />
          ) : null}

          {m.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.avatarUrl}
              alt={m.author}
              className="size-8 rounded-full object-cover"
            />
          )}

          <div className="flex flex-col text-white">
            <span className="font-semibold text-sm">{m.author}</span>
            <span className="text-sm">{m.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatOverlay;
