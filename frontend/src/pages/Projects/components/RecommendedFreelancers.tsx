import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import { Link as RouterLink } from "react-router-dom";
import { useGetRecommendedFreelancers } from "../hooks/useGetRecommendedFreelancers";

type Props = {
  projectId: string;
};

export const RecommendedFreelancers = ({ projectId }: Props) => {
  const { data, isLoading, isError } = useGetRecommendedFreelancers(projectId, 6);

  if (isLoading) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Loading freelancer recommendations...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={800} mb={1}>
            Recommended freelancers
          </Typography>
          <Typography variant="body2" color="error">
            Failed to load recommendations.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <PersonSearchRoundedIcon color="primary" />
            <Typography variant="h6" fontWeight={800}>
              Recommended freelancers
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            No recommendations available for this project yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <PersonSearchRoundedIcon color="primary" />
          <Typography variant="h6" fontWeight={800}>
            Recommended freelancers
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {data.map((freelancer, index) => (
            <Box key={freelancer.freelancerId}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: "divider",
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={freelancer.avatarUrl ?? undefined}
                        sx={{ width: 52, height: 52 }}
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
                          mt={0.75}
                        >
                          <Chip
                            icon={<TrendingUpRoundedIcon />}
                            label={`${freelancer.score}% match`}
                            color="primary"
                            size="small"
                          />

                          {freelancer.rating !== null &&
                            freelancer.rating !== undefined && (
                              <Chip
                                icon={<StarRoundedIcon />}
                                label={`${freelancer.rating.toFixed(1)} rating`}
                                size="small"
                              />
                            )}

                          {freelancer.hourlyRate !== null &&
                            freelancer.hourlyRate !== undefined && (
                              <Chip
                                icon={<AttachMoneyRoundedIcon />}
                                label={`$${freelancer.hourlyRate}/hr`}
                                size="small"
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
                          color="text.secondary"
                        >
                          Matched skills
                        </Typography>
                        <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                          {freelancer.matchedSkills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {!!freelancer.matchedCategories.length && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          mb={1}
                          color="text.secondary"
                        >
                          Matched categories
                        </Typography>
                        <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                          {freelancer.matchedCategories.map((category) => (
                            <Chip key={category} label={category} size="small" />
                          ))}
                        </Stack>
                      </Box>
                    )}

                    <Box>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        mb={0.75}
                        color="text.secondary"
                      >
                        Why recommended
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {freelancer.reason}
                      </Typography>
                    </Box>

                    <Button
                      component={RouterLink}
                      to={`/profile/${freelancer.freelancerId}`}
                      variant="contained"
                      size="small"
                      sx={{ alignSelf: "flex-start", borderRadius: 2.5 }}
                    >
                      View profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {index < data.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};