"use client";

import { use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SiKick, SiTwitch } from "react-icons/si";
import { io, type Socket } from "socket.io-client";

type IncomingChatMessage = {
  roomId: string;
  author: string;
  text: string;
  platform?: string;
  avatarUrl?: string;
};

type Direction = "up" | "down";
type DisplayMode = "persist" | "fade";

type ChatMessage = IncomingChatMessage & {
  localId: string;
  isVisible?: boolean;
};

type TimerHandle = ReturnType<typeof setTimeout> | number;

// Keep message count low so the vertical overlay never feels crowded.
const MAX_MESSAGES = 20;
const DEFAULT_FADE_SECONDS = 10;
const FADE_ANIMATION_MS = 400;

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
  const searchParams = useSearchParams();

  const direction = useMemo<Direction>(() => {
    const raw = searchParams.get("direction");
    return raw === "down" ? "down" : "up";
  }, [searchParams]);

  const mode = useMemo<DisplayMode>(() => {
    const raw = searchParams.get("mode");
    return raw === "fade" ? "fade" : "persist";
  }, [searchParams]);

  const fadeSeconds = useMemo(() => {
    if (mode !== "fade") return DEFAULT_FADE_SECONDS;
    const raw = Number(searchParams.get("duration"));
    return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_FADE_SECONDS;
  }, [mode, searchParams]);

  const fadeDurationMs = mode === "fade" ? fadeSeconds * 1000 : null;
  const fadeTimers = useRef(new Map<string, TimerHandle>());
  const cleanupTimers = useRef(new Map<string, TimerHandle>());

  const clearMessageTimers = useCallback((messageId: string) => {
    const fadeTimer = fadeTimers.current.get(messageId);
    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimers.current.delete(messageId);
    }

    const cleanupTimer = cleanupTimers.current.get(messageId);
    if (cleanupTimer) {
      clearTimeout(cleanupTimer);
      cleanupTimers.current.delete(messageId);
    }
  }, []);

  const scheduleFadeLifecycle = useCallback(
    (messageId: string) => {
      if (mode !== "fade" || !fadeDurationMs) return;

      const fadeTimer = window.setTimeout(() => {
        fadeTimers.current.delete(messageId);
        setMessages((prev) =>
          prev.map((m) =>
            m.localId === messageId ? { ...m, isVisible: false } : m
          )
        );

        const cleanupTimer = window.setTimeout(() => {
          cleanupTimers.current.delete(messageId);
          setMessages((prev) => prev.filter((m) => m.localId !== messageId));
        }, FADE_ANIMATION_MS);

        cleanupTimers.current.set(messageId, cleanupTimer);
      }, fadeDurationMs);

      fadeTimers.current.set(messageId, fadeTimer);
    },
    [fadeDurationMs, mode]
  );

  useEffect(() => {
    if (mode !== "persist") return;

    const fadeMap = fadeTimers.current;
    const cleanupMap = cleanupTimers.current;
    fadeMap.forEach((timer) => clearTimeout(timer));
    cleanupMap.forEach((timer) => clearTimeout(timer));
    fadeMap.clear();
    cleanupMap.clear();

    if (typeof window === "undefined") return;

    const frame = window.requestAnimationFrame(() => {
      setMessages((prev) =>
        prev.map((message) => ({ ...message, isVisible: true }))
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mode]);

  useEffect(() => {
    const fadeMap = fadeTimers.current;
    const cleanupMap = cleanupTimers.current;
    return () => {
      fadeMap.forEach((timer) => clearTimeout(timer));
      cleanupMap.forEach((timer) => clearTimeout(timer));
      fadeMap.clear();
      cleanupMap.clear();
    };
  }, []);

  useEffect(() => {
    const socket: Socket = io(socketUrl, {
      transports: ["websocket"],
      query: { roomId },
    });

    const handler = (msg: IncomingChatMessage) => {
      if (msg.roomId !== roomId) return;

      const localId = generateMessageId();
      const nextMessage: ChatMessage = { ...msg, localId, isVisible: true };

      setMessages((prev) => {
        const appended = [...prev, nextMessage];
        if (appended.length > MAX_MESSAGES) {
          const overflowCount = appended.length - MAX_MESSAGES;
          const removed = appended.slice(0, overflowCount);
          removed.forEach((entry) => clearMessageTimers(entry.localId));
          return appended.slice(overflowCount);
        }

        return appended;
      });

      if (mode === "fade") {
        scheduleFadeLifecycle(localId);
      }
    };

    socket.on("chat:message", handler);
    return () => {
      socket.off("chat:message", handler);
      socket.disconnect();
    };
  }, [clearMessageTimers, mode, roomId, scheduleFadeLifecycle]);

  return (
    <div
      className={`w-full h-full flex flex-col p-4 gap-2 ${
        direction === "down" ? "justify-start" : "justify-end"
      }`}
    >
      {messages.map((m) => (
        <div
          key={m.localId}
          className={`rounded-xl bg-black/70 px-3 py-2 backdrop-blur flex gap-3 items-center ${
            direction === "down" ? "chat-pop-in-down" : "chat-pop-in"
          } ${
            mode === "fade"
              ? m.isVisible
                ? "opacity-100 translate-y-0"
                : `opacity-0 ${
                    direction === "down" ? "translate-y-2" : "-translate-y-2"
                  }`
              : "opacity-100 translate-y-0"
          } transition-[opacity,transform] duration-300 ease-out`}
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
