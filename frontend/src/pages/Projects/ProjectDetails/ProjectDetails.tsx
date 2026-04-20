import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  Avatar,
  Divider,
  Paper,
  Grid,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useParams } from "react-router-dom";
import { useGetProjectDetails } from "../hooks/useGetProjectDetails";
import { Loader } from "../../../common/Loader";
import { OwnerInfo } from "../components/OwnerInfo";
import { RecommendedFreelancers } from "../components/RecommendedFreelancers";

const DUMMY_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetProjectDetails(id ?? "");

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h5" fontWeight={800}>
          Project not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                height: 240,
                backgroundImage: `url(${DUMMY_IMAGE})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.20) 0%, rgba(15,23,42,0.78) 100%)",
                }}
              />
              <Stack
                spacing={2}
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  p: { xs: 2, md: 4 },
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight={900}
                  color="#fff"
                  sx={{ maxWidth: 900 }}
                >
                  {data.title}
                </Typography>

                <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                  {data.projectCategories?.map((c, i) => (
                    <Chip
                      key={`${c.name}-${i}`}
                      label={c.name}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.14)",
                        color: "#fff",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h5" fontWeight={800} mb={2}>
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}
                  >
                    {data.description || "No description provided."}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Technologies
                  </Typography>

                  <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                    {data.projectTechnologies?.length ? (
                      data.projectTechnologies.map((t, i) => (
                        <Chip
                          key={`${t.name}-${i}`}
                          label={t.name}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No technologies specified.
                      </Typography>
                    )}
                  </Stack>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Categories
                  </Typography>

                  <Stack direction="row" gap={1} flexWrap="wrap" useFlexGap>
                    {data.projectCategories?.length ? (
                      data.projectCategories.map((c, i) => (
                        <Chip key={`${c.name}-${i}`} label={c.name} />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No categories specified.
                      </Typography>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        Budget
                      </Typography>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                          <AttachMoneyIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={800}>
                          {data.budgetMin && data.budgetMax
                            ? `$${data.budgetMin} - $${data.budgetMax}`
                            : "Not specified"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={1}>
                        Deadline
                      </Typography>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Avatar sx={{ bgcolor: "secondary.light", color: "secondary.main" }}>
                          <CalendarTodayIcon />
                        </Avatar>
                        <Typography variant="body1" fontWeight={700}>
                          {data.dueDate || "No deadline"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
                        Owner
                      </Typography>

                      {data.owner ? (
                        <OwnerInfo owner={data.owner} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No owner information
                        </Typography>
                      )}
                    </Box>

                    {data.executor && (
                      <>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" mb={1}>
                            Executor
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {data.executor.email}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Paper>

                <RecommendedFreelancers projectId={data.id} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};