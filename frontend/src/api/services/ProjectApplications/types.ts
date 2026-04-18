export enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export type CreateProjectApplicationDto = {
  projectId: string;
  coverLetter?: string;
};

export type ProjectApplicationItem = {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
    status: string;
    budgetMin?: number;
    budgetMax?: number;
  };
  freelancer?: {
    id: string;
    fullName: string;
    email?: string;
    avatar_url?: string;
  };
};