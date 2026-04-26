import { Avatar, Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type UserPreviewLinkProps = {
  user: {
    id: string;
    fullName: string;
    email?: string;
    avatar?: string;
    avatar_url?: string;
  };
  subtitle?: string;
  dense?: boolean;
};

export const UserPreviewLink = ({
  user,
  subtitle,
  dense = false,
}: UserPreviewLinkProps) => {
  const avatarSrc = user.avatar ?? user.avatar_url;

  return (
    <Box
      component={RouterLink}
      to={`/profile/${user.id}`}
      onClick={(e) => e.stopPropagation()}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.2,
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        px: 0.5,
        py: 0.4,
        transition: "0.2s",
        "&:hover": {
          bgcolor: "action.hover",
          color: "primary.main",
        },
      }}
    >
      <Avatar src={avatarSrc} sx={{ width: dense ? 30 : 36, height: dense ? 30 : 36 }}>
        {user.fullName?.[0]}
      </Avatar>

      <Box>
        <Typography fontWeight={600} fontSize={dense ? 13 : 14}>
          {user.fullName}
        </Typography>

        {(subtitle || user.email) && (
          <Typography variant="caption" color="text.secondary">
            {subtitle ?? user.email}
          </Typography>
        )}
      </Box>
    </Box>
  );
};