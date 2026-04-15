import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import type { User } from "../../../../api/services/Profile/types";

type Props = {
  user: User;
};

export const OverviewTab = ({ user }: Props) => {
  const profile = user?.profile;

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={1}>
          About
        </Typography>

        <Typography color="text.secondary">
          {profile?.bio || "No bio provided."}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography fontWeight={600}>Stats</Typography>

        <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
          <Box>
            <Typography fontWeight={700}>
              {user?.executedProjects?.length || 0}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Completed
            </Typography>
          </Box>

          <Box>
            <Typography fontWeight={700}>
              {profile?.rating?.toFixed(1) || "0.0"}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Rating
            </Typography>
          </Box>

          <Box>
            <Typography fontWeight={700}>
              {user?.ownedProjects?.length || 0}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Created
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography fontWeight={600} mb={1}>
          Details
        </Typography>

        <Stack spacing={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Experience</Typography>
            <Typography>
              {profile?.experienceLevel || "Not specified"}
            </Typography>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Hourly rate</Typography>
            <Typography>
              {profile?.hourlyRate
                ? `$${profile.hourlyRate}/hr`
                : "Not specified"}
            </Typography>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between">
            <Typography color="text.secondary">Location</Typography>
            <Typography>
              {profile?.location || "Not specified"}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};