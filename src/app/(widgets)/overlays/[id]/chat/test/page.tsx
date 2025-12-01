"use client";

import { client } from "@/lib/client";
import { useWebSocket } from "jstack/client";
import { use } from "react";

const socket = client.overlays.chat.$ws();

const TestChatOverlay = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  console.log(id);
  const roomId = `overlay-chat-${id}`;
  console.log(roomId);

  useWebSocket(socket, {
    onConnect: () => {
      socket.emit("message", {
        roomId,
        author: "Test",
        text: "Test",
        platform: "Kick",
        avatarUrl: undefined,
      });
    },
  });

  return (
    <div>
      <p>Testing webhook sending, check the output on the widget</p>
    </div>
  );
};

export default TestChatOverlay;
