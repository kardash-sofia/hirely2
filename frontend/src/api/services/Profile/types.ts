import type { ProjectItemType } from "../../../pages/Projects/types";

export type User = {
  id: string;
  fullName: string;
  role: string;
  avatar_url?: string;
  email?: string;
  ownedProjects?: ProjectItemType[];
  executedProjects?: ProjectItemType[];
  profile?: {
    hourlyRate?: number;
    location?: string;
    rating?: number;
    bio?: string;
    skills?: string[];
    categories?: string;
    experienceLevel?: string;
  }
}