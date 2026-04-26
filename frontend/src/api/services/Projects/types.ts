import type { NamedEntity } from "../../types";

export type GetProjectsQuery = {
  limit?: number;
  offset?: number;
  status?: string;
  categories?: string[];
  technologies?: string[];
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
}

export type CreateTaskType = {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
};

export type CreateProjectType = {
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  categoryIds: string[];
  technologyIds: string[];
  tasks: CreateTaskType[];
};

export type ProjectConstants = {
  categories: NamedEntity[];
  technologies: NamedEntity[];
};

export const TaskPriorities = [
  { value: 0, label: "Lowest", color: "#BDBDBD" },
  { value: 1, label: "Low", color: "#8FC1FF" },
  { value: 2, label: "Medium", color: "#FFD966" },
  { value: 3, label: "High", color: "#FFAB91" },
  { value: 4, label: "Very High", color: "#FF6D6D" },
  { value: 5, label: "Critical", color: "#D32F2F" },
];

export enum ProjectStatus {
  OPEN = "open",
  PENDING_REVIEW = "pending_review",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type ProjectItemType = {
  id: string;
  title: string;
  description?: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
  budgetMin?: number;
  budgetMax?: number;
  categories: string[];
  status: ProjectStatus;
};

export type ProjectTask = {
  id: string;
  title: string;
  description?: string;
  priority: number;
  status: string;
  dueDate?: string;
};

export type ProjectDetails = ProjectItemType & {
  technologies: string[];
  executor?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
  projectTechnologies?: NamedEntity[];
  projectCategories?: NamedEntity[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: ProjectTask[];
};

export type FiltersState = {
  status: ProjectStatus | "";
  categories: string[];
  technologies: string[];
  sortField: string;
  sortOrder: "ASC" | "DESC";
};