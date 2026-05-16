import { Box } from "@mui/material";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { useChat } from "../useChat";
import type { Chat } from "../types";

export const ChatWindow = ({ chatId, chats }: { chatId: string; chats: Chat[] }) => {
  const {
    messages,
    sendMessage,
  } = useChat(chatId);

  const chat = chats.find((c) => c.id === chatId);

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <ChatHeader chatName={chat?.title || "Chat"} />

      <MessagesList messages={messages} />

      <MessageInput sendMessage={sendMessage} />
    </Box>
  );
};