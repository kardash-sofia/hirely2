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
}

export type CreateProjectType = {
  title: string;
  description?: string;
  budgetMin?: number;
  budgetMax?: number;
  categoryIds: string[];
  technologyIds: string[];
  tasks: CreateTaskType[];
}
