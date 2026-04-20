export type RecommendedFreelancer = {
  freelancerId: string;
  fullName: string;
  avatarUrl?: string | null;

  score: number;

  technologyScore: number;
  categoryScore: number;
  budgetScore: number;
  experienceScore: number;
  ratingScore: number;

  matchedSkills: string[];
  matchedCategories: string[];

  hourlyRate?: number | null;
  rating?: number | null;
  experienceLevel?: string | null;

  reason: string;
};
