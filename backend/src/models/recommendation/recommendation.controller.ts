import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { RecommendedFreelancerDto } from './dto/recommended-freelancer.dto';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('projects/:projectId/freelancers')
  getRecommendedFreelancers(
    @Param('projectId') projectId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<RecommendedFreelancerDto[]> {
    return this.recommendationService.getRecommendedFreelancersForProject(projectId, limit ?? 10);
  }
}
