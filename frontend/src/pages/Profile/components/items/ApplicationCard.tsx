import {
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type {
  ProjectApplicationItem,
  ApplicationStatus,
} from "../../../../api/services/ProjectApplications/types";
import { useWithdrawProjectApplication } from "../../../Projects/hooks/useApplicationActions";
import { Role } from "../../../Auth/types";

type Props = {
  application: ProjectApplicationItem;
  mode: "owner" | "freelancer";
};

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case "PENDING":
      return { bg: "#FFF4E5", color: "#B26A00" };
    case "ACCEPTED":
      return { bg: "#E6F4EA", color: "#2E7D32" };
    case "REJECTED":
      return { bg: "#FDECEA", color: "#C62828" };
    case "WITHDRAWN":
      return { bg: "#ECEFF1", color: "#546E7A" };
    default:
      return { bg: "#F3F0FF", color: "#46307B" };
  }
};

export const ApplicationCard = ({ application, mode }: Props) => {
  const withdrawMutation = useWithdrawProjectApplication();

  const isPending = application.status === "PENDING";
  const statusStyles = getStatusColor(application.status);

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        transition: "0.2s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <Stack spacing={1.5}>
        {/* 🔹 Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          {mode === Role.FREELANCER && 
          <Typography
            component={Link}
            to={`/projects/${application.project?.id}`}
            sx={{
              fontWeight: 600,
              textDecoration: "none",
              color: "inherit",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {application.project?.title || "Project"}
          </Typography>}


          <Chip
            label={application.status}
            size="small"
            sx={{
              background: statusStyles.bg,
              color: statusStyles.color,
              fontWeight: 500,
            }}
          />
        </Stack>

        {/* 🔹 Budget */}
        {(application.project?.budgetMin ||
          application.project?.budgetMax) && (
          <Typography fontSize={13} color="text.secondary">
            💰{" "}
            {application.project?.budgetMin &&
            application.project?.budgetMax
              ? `$${application.project.budgetMin} - $${application.project.budgetMax}`
              : "Budget not specified"}
          </Typography>
        )}

        {/* 🔹 Cover letter */}
        {application.coverLetter && (
          <Typography
            fontSize={14}
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {application.coverLetter}
          </Typography>
        )}

        {/* 🔹 Footer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pt={1}
        >
          <Typography fontSize={12} color="text.secondary">
            Applied:{" "}
            {new Date(application.createdAt).toLocaleDateString()}
          </Typography>

          {mode === "freelancer" && isPending && (
            <Button
              size="small"
              color="error"
              onClick={() => withdrawMutation.mutate(application.id)}
            >
              Withdraw
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};