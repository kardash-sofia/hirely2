import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { Loader } from "../../../common/Loader";
import { useSnackbar } from "../../../common/Snackbar/useSnackbar";
import { SnackbarType } from "../../../common/Snackbar/types";
import { useAuth } from "../../../app/context/AuthContext";
import { Role } from "../../Auth/types";
import { ApplyToProjectModal } from "../components/ApplyToProjectModal";
import { useGetProjectDetails } from "../hooks/useGetProjectDetails";
import { useGetProjectApplications } from "../hooks/useGetProjectApplications";
import { useGetMyProjectApplication } from "../hooks/useGetMyProjectApplication";
import {
  useAcceptProjectApplication,
  useRejectProjectApplication,
  useWithdrawProjectApplication,
} from "../hooks/useApplicationActions";
import {
  useCancelProject,
  useCompleteProject,
  useRequestProjectRework,
  useSubmitProjectForReview,
} from "../hooks/useProjectLifecycleActions";
import { ProjectStatus } from "../types";
import { ApplicationStatus } from "../../../api/services/ProjectApplications/types";
import { applicationStatusLabelMap, projectStatusColorMap, statusLabelMap } from "./constants";
import { UserPreviewLink } from "../../../common/UserPreviewLink/UserPreviewLink";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import { RecommendedFreelancersDrawer } from "../components/RecommendedFreelancersDrawer";

export const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ?? "";

  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isRecommendationsOpen, setIsRecommendationsOpen] = useState(false);

  const { data, isLoading } = useGetProjectDetails(projectId);

  const isOwner = !!user && !!data && user.id === data.owner.id;
  const isExecutor = !!user && !!data?.executor && user.id === data.executor.id;
  const isFreelancer = user?.role === Role.FREELANCER;

  const { data: applications } = useGetProjectApplications(projectId, isOwner);
  console.log("Project applications:", applications);
  const { data: myApplication } = useGetMyProjectApplication(
    projectId,
    !!projectId && !!user && !isOwner && isFreelancer,
  );

  const withdrawMutation = useWithdrawProjectApplication();
  const acceptMutation = useAcceptProjectApplication(projectId);
  const rejectMutation = useRejectProjectApplication(projectId);

  const submitForReviewMutation = useSubmitProjectForReview(projectId);
  const requestReworkMutation = useRequestProjectRework(projectId);
  const completeMutation = useCompleteProject(projectId);
  const cancelMutation = useCancelProject(projectId);

  const canApply =
    !!user &&
    isFreelancer &&
    !isOwner &&
    data?.status === ProjectStatus.OPEN &&
    !myApplication;

  const canWithdraw =
    !!myApplication &&
    myApplication.status === ApplicationStatus.PENDING &&
    data?.status === ProjectStatus.OPEN;

  const infoMessage = useMemo(() => {
    if (!user) return "Log in to interact with the project.";
    if (isOwner) return "You are the owner of this project.";
    if (isExecutor) return "You are the assigned executor of this project.";
    if (myApplication) {
      return `Your application status: ${
        applicationStatusLabelMap[myApplication.status]
      }.`;
    }
    return null;
  }, [user, isOwner, isExecutor, myApplication]);

  if (isLoading) {
    return <Loader loading={isLoading} />;
  }

  if (!data) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5">Project not found</Typography>
      </Container>
    );
  }

  const handleError = (error: Error, fallback: string) => {
    showSnackbar(error.message || fallback, SnackbarType.ERROR);
  };

  const handleSuccess = (message: string) => {
    showSnackbar(message, SnackbarType.SUCCESS);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {data.title}
                </Typography>

                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap={1}
                >
                  <Chip
                    label={statusLabelMap[data.status]}
                    color={projectStatusColorMap[data.status]}
                  />
                  {data.projectCategories?.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              <Stack
                direction="row"
                flexWrap="wrap"
                gap={1}
              >
                {canApply && (
                  <Button
                    variant="contained"
                    onClick={() => setIsApplyOpen(true)}
                  >
                    Apply to project
                  </Button>
                )}

                {canWithdraw && myApplication && (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() =>
                      withdrawMutation.mutate(myApplication.id, {
                        onSuccess: () =>
                          handleSuccess("Application withdrawn successfully"),
                        onError: (error: Error) =>
                          handleError(error, "Failed to withdraw application"),
                      })
                    }
                  >
                    Withdraw application
                  </Button>
                )}

                {isExecutor && data.status === ProjectStatus.IN_PROGRESS && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                      submitForReviewMutation.mutate(undefined, {
                        onSuccess: () =>
                          handleSuccess("Project submitted for review"),
                        onError: (error: Error) =>
                          handleError(error, "Failed to submit for review"),
                      })
                    }
                  >
                    Submit for review
                  </Button>
                )}

                {isOwner && data.status === ProjectStatus.PENDING_REVIEW && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        completeMutation.mutate(undefined, {
                          onSuccess: () =>
                            handleSuccess("Project marked as completed"),
                          onError: (error: Error) =>
                            handleError(error, "Failed to complete project"),
                        })
                      }
                    >
                      Approve & complete
                    </Button>

                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() =>
                        requestReworkMutation.mutate(undefined, {
                          onSuccess: () =>
                            handleSuccess("Project returned for rework"),
                          onError: (error: Error) =>
                            handleError(error, "Failed to request rework"),
                        })
                      }
                    >
                      Request rework
                    </Button>
                  </>
                )}

                {isOwner &&
                  [ProjectStatus.OPEN, ProjectStatus.IN_PROGRESS, ProjectStatus.PENDING_REVIEW].includes(
                    data.status,
                  ) && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        cancelMutation.mutate(undefined, {
                          onSuccess: () =>
                            handleSuccess("Project cancelled successfully"),
                          onError: (error: Error) =>
                            handleError(error, "Failed to cancel project"),
                        })
                      }
                    >
                      Cancel project
                    </Button>
                  )}

                  {isOwner && (
                    <Button
                      variant="contained"
                      startIcon={<PersonSearchRoundedIcon />}
                      onClick={() => setIsRecommendationsOpen(true)}
                    >
                      Find freelancers
                    </Button>
                  )}
              </Stack>
            </Stack>

            {infoMessage && <Alert severity="info">{infoMessage}</Alert>}

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography color="text.secondary">
                {data.description || "No description provided."}
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", md: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon fontSize="small" />
                <Typography>
                  {data.budgetMin && data.budgetMax
                    ? `$${data.budgetMin} - $${data.budgetMax}`
                    : "Budget not specified"}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" />
                <Typography>{data.dueDate || "No deadline"}</Typography>
              </Stack>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Technologies
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data.projectTechnologies?.length ? (
                  data.projectTechnologies.map((technology) => (
                    <Chip
                      key={technology.id}
                      label={technology.name}
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No technologies specified.
                  </Typography>
                )}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {data.projectCategories?.length ? (
                  data.projectCategories.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No categories specified.
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ p: 4, borderRadius: 4 }}>
         <Typography variant="h6" fontWeight={700}>
          Owner
        </Typography>

        {data.owner ? (
          <UserPreviewLink user={data.owner} />
        ) : (
          <Typography color="text.secondary">No owner information</Typography>
        )}

        {data.executor && (
          <>
            <Typography variant="h6" fontWeight={700} mt={3}>
              Executor
            </Typography>

            <UserPreviewLink user={data.executor} />
          </>
        )}
        </Paper>

        {isOwner && (
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" gutterBottom>
              Applications
            </Typography>

            {!applications?.length ? (
              <Typography color="text.secondary">
                No applications yet.
              </Typography>
            ) : (
              <List disablePadding>
                {applications.map((application) => {
                  const freelancerName =
                    application.freelancer?.fullName || "Unknown freelancer";

                  const email = application.freelancer?.authUser?.email || "No email";

                  return (
                    <ListItem
                      key={application.id}
                      divider
                      disableGutters
                      secondaryAction={
                        application.status === ApplicationStatus.PENDING &&
                        data.status === ProjectStatus.OPEN ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() =>
                                acceptMutation.mutate(application.id, {
                                  onSuccess: () =>
                                    handleSuccess("Application accepted"),
                                  onError: (error: Error) =>
                                    handleError(error, "Failed to accept application"),
                                })
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                rejectMutation.mutate(application.id, {
                                  onSuccess: () =>
                                    handleSuccess("Application rejected"),
                                  onError: (error: Error) =>
                                    handleError(error, "Failed to reject application"),
                                })
                              }
                            >
                              Reject
                            </Button>
                          </Stack>
                        ) : null
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {freelancerName.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Typography fontWeight={600}>
                              {freelancerName}
                            </Typography>
                            <Chip
                              size="small"
                              label={applicationStatusLabelMap[application.status]}
                              color={
                                application.status === ApplicationStatus.ACCEPTED
                                  ? "success"
                                  : application.status === ApplicationStatus.PENDING
                                  ? "warning"
                                  : "default"
                              }
                            />
                          </Stack>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {email}
                            </Typography>

                            {application.coverLetter && (
                              <Typography
                                variant="body2"
                                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                              >
                                {application.coverLetter}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        )}

        {isOwner && (
          <RecommendedFreelancersDrawer
            open={isRecommendationsOpen}
            onClose={() => setIsRecommendationsOpen(false)}
            projectId={projectId}
          />
        )}

        <ApplyToProjectModal
          open={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          projectId={projectId}
          projectTitle={data.title}
        />
      </Stack>
    </Container>
  );
};