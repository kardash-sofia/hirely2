import { Box } from "@mui/material";
import { useEffect, useMemo, useRef } from "react";

import { useAuth } from "../../Auth/useAuth";
import type { Message } from "../types";

export const MessagesList = ({ messages }: { messages: Message[] }) => {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return timeA - timeB;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        background: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: "auto",
        }}
      >
        {sortedMessages.map((msg) => {
          const isMine = msg.senderId === user?.id;

          return (
            <Box
              key={msg.id}
              sx={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                background: isMine ? "#B275FF" : "#fff",
                color: isMine ? "#fff" : "#000",
                px: 2,
                py: 1,
                borderRadius: "16px",
                maxWidth: "60%",
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </Box>
          );
        })}

        <div ref={bottomRef} />
      </Box>
    </Box>
  );
};