import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsQueryDto } from './dto/get-projects.dto';
import { PredictProfitDto, PredictShipDto } from './dto/prediction.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjects(query);
  }

  @Post('predict_profit')
  async predictProfit(@Body() dto: PredictProfitDto) {
    console.log('Received predict profit request:', dto);
    return this.projectService.predictProfit(dto);
  }

  @Post('predict_ship')
  async predictShip(@Body() dto: PredictShipDto) {
    return this.projectService.predictShip(dto);
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const ownerId = '098d10c2-b014-4a3d-b650-2fe4ee453785';
    return this.projectService.createProject(dto, ownerId);
  }
}
