import type { ProjectItemType } from "../../../pages/Projects/types";
import type { NamedEntity } from "../../types";

export type User = {
  id: string;
  fullName: string;
  role: string;
  avatar_url?: string;
  email?: string;
  ownedProjects?: ProjectItemType[];
  executedProjects?: ProjectItemType[];
  profile?: {
    id: string;
    hourlyRate?: number;
    location?: string;
    rating?: number;
    bio?: string;
    skills?: NamedEntity[];
    categories?: NamedEntity[];
    technologies?: NamedEntity[];
    experienceLevel?: string;
  }
}

export type ProfilePlaceholders = {
  skills: NamedEntity[];
  categories: NamedEntity[];
  technologies: NamedEntity[];
};

export type UpdateProfile = {
  bio: string;
  hourlyRate: string | number;
  location: string;
  experienceLevel: string;
  skillIds: string[];
  technologyIds: string[];
  categoryIds: string[];
}