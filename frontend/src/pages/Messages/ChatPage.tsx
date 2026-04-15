import { Box } from "@mui/material";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import { useState } from "react";

export const ChatPage = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ChatSidebar activeChat={activeChat} setActiveChat={setActiveChat} />
      {activeChat && <ChatWindow chatId={activeChat} />}
    </Box>
  );
};