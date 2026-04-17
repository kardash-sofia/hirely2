import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsQueryDto } from './dto/get-projects.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('byId/:id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateProjectDto, @Req() req: any) {
    console.log(req.user);
    const ownerId = req.user.userId;
    return this.projectService.createProject(dto, ownerId);
  }

  @Get()
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjects(query);
  }

  @Get('constants')
  async getConstants() {
    return await this.projectService.getProjectConstants();
  }
}
