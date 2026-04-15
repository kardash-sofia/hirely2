import { Box, IconButton, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export const MessageInput = ({
  sendMessage,
}: {
  sendMessage: (text: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(message);
    setMessage("");
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid #eee",
        display: "flex",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        size="small"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />

      <IconButton onClick={handleSend} color="primary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};