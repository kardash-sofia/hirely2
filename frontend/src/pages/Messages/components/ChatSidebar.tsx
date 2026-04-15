import {
  Box,
  List,
  ListItemButton,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import { useChat } from "../useChat";
import { useAuth } from "../../Auth/useAuth";
import { useEffect } from "react";

export const ChatSidebar = ({
  activeChat,
  setActiveChat,
}: {
  activeChat: string | null;
  setActiveChat: (id: string) => void;
}) => {
  const { user } = useAuth();
  const { createChat, chats, getChats } = useChat();

  useEffect(() => {
    if (!user) return;
    getChats();
  }, [user, getChats]);

  const handleCreateFakeChat = () => {
    if (!user) return;

    createChat(
      ["cbf13007-b1fc-40d5-aa3a-21ad5a65132c", user.id],
      "ruslana"
    );
  };

  return (
    <Box
      sx={{
        width: 320,
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography fontWeight={600}>Chats</Typography>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
          onClick={handleCreateFakeChat}
        >
          Create Fake Chat
        </Button>
      </Box>

      {/* CHAT LIST */}
      <List sx={{ flex: 1, overflowY: "auto" }}>
        {chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={activeChat === chat.id}
            onClick={() => setActiveChat(chat.id)}
          >
            <Avatar sx={{ mr: 2 }}>
              {chat.title?.[0]?.toUpperCase() || "?"}
            </Avatar>

            <Box>
              <Typography fontWeight={500}>
                {chat.title || "No title"}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};