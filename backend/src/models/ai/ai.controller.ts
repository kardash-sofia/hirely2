import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { PredictBudgetDto, PredictBudgetResponseDto } from './dto/predict-budget.dto';
import { PredictCategoryDto, PredictCategoryResponseDto } from './dto/predict-category.dto';
import {
  GenerateDescriptionDto,
  GenerateDescriptionResponseDto,
} from './dto/generate-description.dto';
import { AssistProjectDto, AssistProjectResponseDto } from './dto/assist-project.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict-budget')
  predictBudget(@Body() payload: PredictBudgetDto): Promise<PredictBudgetResponseDto> {
    return this.aiService.predictBudget(payload);
  }

  @Post('predict-category')
  predictCategory(@Body() payload: PredictCategoryDto): Promise<PredictCategoryResponseDto> {
    return this.aiService.predictCategory(payload);
  }

  @Post('generate-description')
  generateDescription(
    @Body() payload: GenerateDescriptionDto,
  ): Promise<GenerateDescriptionResponseDto> {
    return this.aiService.generateDescription(payload);
  }

  @Post('assist-project')
  assistProject(@Body() payload: AssistProjectDto): Promise<AssistProjectResponseDto> {
    return this.aiService.assistProject(payload);
  }
}
