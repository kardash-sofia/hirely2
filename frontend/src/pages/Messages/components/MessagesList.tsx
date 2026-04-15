import { Box } from "@mui/material";
import { useAuth } from "../../Auth/useAuth";

type Message = {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
};

export const MessagesList = ({
  messages,
}: {
  messages: Message[];
}) => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        background: "#f5f5f5",
      }}
    >
      {messages.map((msg) => {
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
            }}
          >
            {msg.content}
          </Box>
        );
      })}
    </Box>
  );
};