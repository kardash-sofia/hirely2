import { Box, Avatar, Typography } from "@mui/material";

export const ChatHeader = ({ chatName }: { chatName: string }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Avatar>{chatName?.[0]?.toUpperCase() || "?"}</Avatar>

      <Box>
        <Typography fontWeight={600}>{chatName}</Typography>

        <Typography variant="body2" color="text.secondary">
          online
        </Typography>
      </Box>
    </Box>
  );
};