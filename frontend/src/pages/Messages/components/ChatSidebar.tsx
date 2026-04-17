import {
  Box,
  List,
  ListItemButton,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Chat } from "../types";

type Props = {
  chats: Chat[];
  activeChatId?: string;
  onCreateFakeChat?: () => void;
};

export const ChatSidebar = ({
  chats,
  activeChatId,
  onCreateFakeChat,
}: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 320,
        borderRight: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography fontWeight={600}>Chats</Typography>
      </Box>

      <List sx={{ flex: 1, overflowY: "auto", p: 1 }}>
        {chats.map((chat) => (
          <ListItemButton
            key={chat.id}
            selected={activeChatId === chat.id}
            onClick={() => navigate(`/chats/${chat.id}`)}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              alignItems: "center",
            }}
          >
            <Avatar sx={{ mr: 2 }}>
              {chat.title?.[0]?.toUpperCase() || "?"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={500} noWrap>
                {chat.title || "No title"}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};