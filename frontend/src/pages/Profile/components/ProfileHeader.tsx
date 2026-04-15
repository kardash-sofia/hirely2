import { Box, Avatar, Typography, Chip, Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { palette } from "../../../theme/palette";
import type { User } from "../../../api/services/Profile/types";

type Props = {
  user: User;
  isEditing: boolean;
};

export const ProfileHeader = ({ user, isEditing }: Props) => {
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
      {isEditing && (
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
        >
          <EditIcon />
        </IconButton>
      )}

      <Avatar sx={{ width: 80, height: 80 }} />

      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {user?.fullName || ""}
        </Typography>

        <Typography variant="body1" fontWeight={100} sx={{ opacity: 0.8 }}>
          {user?.email || ""}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {user?.profile?.skills?.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              sx={{ background: "#fff", color: "#000" }}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Typography sx={{ opacity: 0.8 }}>
          {user?.role || ""}
        </Typography>
      </Box>
    </Box>
  );
};