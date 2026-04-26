import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsQueryDto } from './dto/get-projects.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { TransitionProjectDto } from './dto/transition-project.dto';

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
    return this.projectService.createProject(dto, req.user.userId);
  }

  @Get()
  getProjects(@Query() query: GetProjectsQueryDto) {
    return this.projectService.getProjects(query);
  }

  @Get('constants')
  async getConstants() {
    return this.projectService.getProjectConstants();
  }

  @Get(':projectId/applications')
  @UseGuards(JwtAuthGuard)
  getProjectApplications(@Param('projectId') projectId: string, @Req() req: any) {
    return this.projectService.getProjectApplications(projectId, req.user.userId);
  }

  @Get(':projectId/my-application')
  @UseGuards(JwtAuthGuard)
  getMyProjectApplication(@Param('projectId') projectId: string, @Req() req: any) {
    return this.projectService.getMyProjectApplication(projectId, req.user.userId);
  }

  @Patch(':projectId/submit-for-review')
  @UseGuards(JwtAuthGuard)
  submitForReview(
    @Param('projectId') projectId: string,
    @Req() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _dto: TransitionProjectDto,
  ) {
    return this.projectService.submitForReview(projectId, req.user.userId);
  }

  @Patch(':projectId/request-rework')
  @UseGuards(JwtAuthGuard)
  requestRework(
    @Param('projectId') projectId: string,
    @Req() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _dto: TransitionProjectDto,
  ) {
    return this.projectService.requestRework(projectId, req.user.userId);
  }

  @Patch(':projectId/complete')
  @UseGuards(JwtAuthGuard)
  completeProject(
    @Param('projectId') projectId: string,
    @Req() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _dto: TransitionProjectDto,
  ) {
    return this.projectService.completeProject(projectId, req.user.userId);
  }

  @Patch(':projectId/cancel')
  @UseGuards(JwtAuthGuard)
  cancelProject(
    @Param('projectId') projectId: string,
    @Req() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() _dto: TransitionProjectDto,
  ) {
    return this.projectService.cancelProject(projectId, req.user.userId);
  }
}
