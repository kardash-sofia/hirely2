import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";

import { Link as RouterLink } from "react-router-dom";

import { useGetRecommendedFreelancers } from "../hooks/useGetRecommendedFreelancers";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};

export const RecommendedFreelancersDrawer = ({
  open,
  onClose,
  projectId,
}: Props) => {
  
    const { data, isLoading, isError } = useGetRecommendedFreelancers(
    projectId,
    6,
    {
      enabled: open,
    },
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 480,
          },
          p: 3,
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={800}>
          Recommended freelancers
        </Typography>

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      {isLoading && (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={20} />

          <Typography color="text.secondary">
            Loading recommendations...
          </Typography>
        </Stack>
      )}

      {isError && (
        <Typography color="error">
          Failed to load recommendations.
        </Typography>
      )}

      {!isLoading && !data?.length && (
        <Typography color="text.secondary">
          No recommendations found.
        </Typography>
      )}

      <Stack spacing={2}>
        {data?.map((freelancer) => (
          <Card
            key={freelancer.freelancerId}
            variant="outlined"
            sx={{
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5}>
                  <Avatar
                    src={freelancer.avatarUrl ?? undefined}
                    sx={{
                      width: 56,
                      height: 56,
                    }}
                  >
                    {freelancer.fullName?.[0]}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={800} noWrap>
                      {freelancer.fullName}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                      mt={1}
                    >
                      <Chip
                        color="primary"
                        size="small"
                        icon={<TrendingUpRoundedIcon />}
                        label={`${freelancer.score}% match`}
                      />

                      {freelancer.rating !== null && (
                        <Chip
                          size="small"
                          icon={<StarRoundedIcon />}
                          label={freelancer.rating?.toFixed(1)}
                        />
                      )}

                      {freelancer.hourlyRate !== null && (
                        <Chip
                          size="small"
                          icon={<AttachMoneyRoundedIcon />}
                          label={`$${freelancer.hourlyRate}/hr`}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>

                {!!freelancer.matchedSkills.length && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      mb={1}
                    >
                      Skills match
                    </Typography>

                    <Stack
                      direction="row"
                      gap={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {freelancer.matchedSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {freelancer.reason}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    component={RouterLink}
                    to={`/profile/${freelancer.freelancerId}`}
                    variant="contained"
                    fullWidth
                  >
                    View profile
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Drawer>
  );
};
