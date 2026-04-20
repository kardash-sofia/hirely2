import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { PredictBudgetDto } from './dto/predict-budget.dto';
import { PredictCategoryDto } from './dto/predict-category.dto';
import { GenerateDescriptionDto } from './dto/generate-description.dto';
import { AssistProjectDto } from './dto/assist-project.dto';

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async predictBudget(payload: PredictBudgetDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/predict/budget`, payload),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    } catch (error) {
      this.handleAiError(error, 'budget prediction');
    }
  }

  async predictCategory(payload: PredictCategoryDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/predict/category`, payload),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    } catch (error) {
      this.handleAiError(error, 'category prediction');
    }
  }

  async generateDescription(payload: GenerateDescriptionDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/generate/description`, payload),
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    } catch (error) {
      this.handleAiError(error, 'description generation');
    }
  }

  async assistProject(payload: AssistProjectDto) {
    const categoryResult = await this.predictCategory({
      title: payload.title,
      description: payload.description,
    });

    const resolvedCategory = payload.category?.trim() || categoryResult.predicted_category;

    const budgetResult = await this.predictBudget({
      title: payload.title,
      description: payload.description,
      technologies: payload.technologies,
      category: resolvedCategory,
      complexity: payload.complexity,
    });

    const descriptionResult = await this.generateDescription({
      title: payload.title,
      short_description: payload.description,
      category: resolvedCategory,
      technologies: payload.technologies,
      complexity: payload.complexity,
      predicted_budget: budgetResult.estimated_budget,
    });

    return {
      category: categoryResult,
      budget: budgetResult,
      description: descriptionResult,
    };
  }

  private handleAiError(error: unknown, operation: string): never {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.detail || error.response?.data?.message || error.message;

      throw new BadGatewayException(`AI service failed during ${operation}: ${message}`);
    }

    throw new InternalServerErrorException(`Unexpected error during ${operation}`);
  }
}
