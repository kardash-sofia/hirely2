import { ApplicationStatus } from "../../../api/services/ProjectApplications/types";
import { ProjectStatus } from "../../../api/services/Projects/types";

export const statusLabelMap: Record<ProjectStatus, string> = {
  [ProjectStatus.OPEN]: "Open",
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.PENDING_REVIEW]: "Pending Review",
  [ProjectStatus.COMPLETED]: "Completed",
  [ProjectStatus.CANCELLED]: "Cancelled",
};

export const projectStatusColorMap: Record<
  ProjectStatus,
  "default" | "primary" | "success" | "warning" | "error"
> = {
  [ProjectStatus.OPEN]: "primary",
  [ProjectStatus.IN_PROGRESS]: "warning",
  [ProjectStatus.PENDING_REVIEW]: "warning",
  [ProjectStatus.COMPLETED]: "success",
  [ProjectStatus.CANCELLED]: "error",
};

export const applicationStatusLabelMap: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Pending",
  [ApplicationStatus.ACCEPTED]: "Accepted",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.WITHDRAWN]: "Withdrawn",
};
