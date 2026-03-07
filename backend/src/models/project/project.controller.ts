import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsQueryDto } from './dto/get-projects.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjects(query);
  }

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    const ownerId = '098d10c2-b014-4a3d-b650-2fe4ee453785';
    return this.projectService.createProject(dto, ownerId);
  }
}
