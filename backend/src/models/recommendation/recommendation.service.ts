import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '../project/entities/project.entity';
import { User } from '../user/entities/user.entity';
import { Roles } from '../user/constants';
import { RecommendedFreelancerDto } from './dto/recommended-freelancer.dto';

@Injectable()
export class RecommendationService {
  async getRecommendedFreelancersForProject(
    projectId: string,
    limit = 10,
  ): Promise<RecommendedFreelancerDto[]> {
    const project = await Project.findOne({
      where: { id: projectId },
      relations: [
        'projectCategories',
        'projectCategories.category',
        'projectTechnologies',
        'projectTechnologies.technology',
        'applications',
      ],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const projectCategoryNames =
      project.projectCategories?.map(pc => pc.category?.name).filter(Boolean) ?? [];

    const projectTechnologyNames =
      project.projectTechnologies?.map(pt => pt.technology?.name).filter(Boolean) ?? [];

    const excludedFreelancerIds = new Set<string>([
      project.ownerId,
      ...(project.applications?.map(a => a.freelancerId) ?? []),
    ]);

    const freelancers = await User.find({
      where: { role: Roles.FREELANCER },
      relations: ['profile', 'profile.skills', 'profile.categories'],
    });

    const recommendations: RecommendedFreelancerDto[] = freelancers
      .filter(user => user.profile)
      .filter(user => !excludedFreelancerIds.has(user.id))
      .map(user => {
        const profile = user.profile!;
        const freelancerSkillNames = profile.skills?.map(s => s.name.toLowerCase()) ?? [];

        const freelancerCategoryNames = profile.categories?.map(c => c.name.toLowerCase()) ?? [];

        const normalizedProjectSkills = projectTechnologyNames.map(t => t.toLowerCase());
        const normalizedProjectCategories = projectCategoryNames.map(c => c.toLowerCase());

        const matchedSkills = projectTechnologyNames.filter(tech =>
          freelancerSkillNames.includes(tech.toLowerCase()),
        );

        const matchedCategories = projectCategoryNames.filter(cat =>
          freelancerCategoryNames.includes(cat.toLowerCase()),
        );

        const technologyScore = normalizedProjectSkills.length
          ? matchedSkills.length / normalizedProjectSkills.length
          : 0;

        const categoryScore = normalizedProjectCategories.length
          ? matchedCategories.length / normalizedProjectCategories.length
          : 0;

        const budgetMid =
          project.budgetMin && project.budgetMax
            ? (project.budgetMin + project.budgetMax) / 2
            : project.budgetMin || project.budgetMax || null;

        let budgetScore = 0.5;
        if (budgetMid && profile.hourlyRate) {
          if (Number(profile.hourlyRate) <= budgetMid) {
            budgetScore = 1;
          } else if (Number(profile.hourlyRate) <= budgetMid * 1.2) {
            budgetScore = 0.7;
          } else if (Number(profile.hourlyRate) <= budgetMid * 1.5) {
            budgetScore = 0.4;
          } else {
            budgetScore = 0.1;
          }
        }

        const experienceScore = this.getExperienceScore(
          profile.experienceLevel ?? null,
          project.tasks?.length ?? 0,
        );

        const ratingScore = Math.min((profile.rating ?? 0) / 5, 1);

        const finalScore =
          0.4 * technologyScore +
          0.25 * categoryScore +
          0.15 * budgetScore +
          0.1 * experienceScore +
          0.1 * ratingScore;

        const score = Math.round(finalScore * 100);

        return {
          freelancerId: user.id,
          fullName: user.fullName,
          avatarUrl: user.avatar_url,
          score,

          technologyScore: Math.round(technologyScore * 100),
          categoryScore: Math.round(categoryScore * 100),
          budgetScore: Math.round(budgetScore * 100),
          experienceScore: Math.round(experienceScore * 100),
          ratingScore: Math.round(ratingScore * 100),

          matchedSkills,
          matchedCategories,

          hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : null,
          rating: profile.rating ? Number(profile.rating) : null,
          experienceLevel: profile.experienceLevel ?? null,

          reason: this.buildReason(matchedSkills, matchedCategories, profile.rating ?? 0),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  }

  private getExperienceScore(experienceLevel: string | null, tasksCount: number): number {
    if (!experienceLevel) return 0.4;

    const level = experienceLevel.toLowerCase();

    if (tasksCount <= 2) {
      if (level.includes('junior')) return 1;
      if (level.includes('middle')) return 0.9;
      if (level.includes('senior')) return 0.75;
    }

    if (tasksCount <= 5) {
      if (level.includes('middle')) return 1;
      if (level.includes('senior')) return 0.9;
      if (level.includes('junior')) return 0.6;
    }

    if (level.includes('senior')) return 1;
    if (level.includes('middle')) return 0.75;
    if (level.includes('junior')) return 0.4;

    return 0.5;
  }

  private buildReason(
    matchedSkills: string[],
    matchedCategories: string[],
    rating: number,
  ): string {
    const parts: string[] = [];

    if (matchedSkills.length) {
      parts.push(`matched skills: ${matchedSkills.join(', ')}`);
    }

    if (matchedCategories.length) {
      parts.push(`matched categories: ${matchedCategories.join(', ')}`);
    }

    if (rating > 0) {
      parts.push(`rating ${rating.toFixed(1)}`);
    }

    return parts.length ? parts.join(' • ') : 'general profile relevance';
  }
}
