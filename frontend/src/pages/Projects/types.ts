import type { NamedEntity } from "../../api/types";

export type ProjectConstants = {
  categories: NamedEntity[];
  technologies: NamedEntity[];
}

export const TaskPriorities = [
  { value: 0, label: "Lowest", color: "#BDBDBD" },
  { value: 1, label: "Low", color: "#8FC1FF" },
  { value: 2, label: "Medium", color: "#FFD966" },
  { value: 3, label: "High", color: "#FFAB91" },
  { value: 4, label: "Very High", color: "#FF6D6D" },
  { value: 5, label: "Critical", color: "#D32F2F" },
];

export enum ProjectStatus {
  OPEN = 'open',
  PENDING_REVIEW = 'pending_review',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
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
}

export type ProjectDetails = ProjectItemType & {
  technologies: string[];
  executor?: {
    id: string;
    fullName: string;
    email: string;
  };
  projectTechnologies?: NamedEntity[];
  projectCategories?: NamedEntity[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
