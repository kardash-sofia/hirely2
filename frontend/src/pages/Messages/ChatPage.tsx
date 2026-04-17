import { Box } from "@mui/material";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatWindow } from "./components/ChatWindow";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "./useChat";
import { useEffect } from "react";

export const ChatPage = () => {
  const { chatId, targetUserId } = useParams<{
    chatId: string;
    targetUserId?: string;
  }>();  
  const { chats, getChats, createDirectChat } = useChat(chatId);
  const navigate = useNavigate();

  useEffect(() => {
    if (chatId === "newChat" && targetUserId) {
      createDirectChat(targetUserId)
        .then((chat) => {
          navigate(`/chats/${chat.id}`);
        })
        .catch(console.error);

      return;
    }

    if (chatId && chatId !== "newChat") {
      console.log("Attempting to join chat:", chatId);
    }
  }, [chatId, targetUserId, createDirectChat, navigate]);

  useEffect(() => {
    getChats().catch((error) => {
      console.error("Failed to get chats:", error);
    });
  }, [getChats]);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ChatSidebar chats={chats} activeChatId={chatId} />
      {chatId && <ChatWindow chats={chats} chatId={chatId} />}
    </Box>
  );
};