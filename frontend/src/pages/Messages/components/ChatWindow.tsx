import { Box } from "@mui/material";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { useChat } from "../useChat";

export const ChatWindow = ({ chatId }: { chatId: string }) => {
  const {
    messages,
    sendMessage,
    chats,
  } = useChat(chatId);

  const chat = chats.find((c) => c.id === chatId);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <ChatHeader chatName={chat?.title || "Chat"} />

      <MessagesList messages={messages} />

      <MessageInput sendMessage={sendMessage} />
    </Box>
  );
};