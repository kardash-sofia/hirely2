import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { palette } from "../../../theme/palette";
import type { User } from "../../../api/services/Profile/types";

type Props = {
  user: User;
  canEdit: boolean;
  onEdit: () => void;
  onMessage?: () => void;
  isMe: boolean;
};


export const ProfileHeader = ({ user, canEdit, onEdit, onMessage, isMe }: Props) => {
  return (
    <Box
      sx={{
        position: "relative",
        p: 3,
        borderRadius: 4,
        background: palette.custom.spaceGradient,
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {canEdit && (
        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "white",
            background: "rgba(255,255,255,0.1)",
            "&:hover": {
              background: "rgba(255,255,255,0.2)",
            },
          }}
          onClick={onEdit}
        >
          <EditIcon />
        </IconButton>
      )}

      <Avatar src={user?.avatar_url ?? undefined} sx={{ width: 80, height: 80 }} />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {user?.fullName || ""}
        </Typography>

        <Typography variant="body1" fontWeight={100} sx={{ opacity: 0.8 }}>
          {user?.email || ""}
        </Typography>
      </Box>

      <Box sx={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ opacity: 0.8 }}>{user?.role || ""}</Typography>

        {!isMe && (
          <Button
            variant="contained"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={onMessage}
            sx={{
              backgroundColor: "#fff",
              color: "#111",
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#f2f2f2",
              },
            }}
          >
            Write message
          </Button>
        )}
      </Box>
    </Box>
  );
};