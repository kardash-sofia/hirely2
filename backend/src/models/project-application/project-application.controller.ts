import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { ProjectApplicationService } from './project-application.service';
import { CreateProjectApplicationDto } from './dto/create-project-application.dto';

@Controller('project-applications')
@UseGuards(JwtAuthGuard)
export class ProjectApplicationController {
  constructor(private readonly applicationService: ProjectApplicationService) {}

  @Post()
  create(@Body() dto: CreateProjectApplicationDto, @Req() req: any) {
    return this.applicationService.create(dto, req.user.userId);
  }

  @Get('my')
  getMyApplications(@Req() req: any) {
    return this.applicationService.getMyApplications(req.user.userId);
  }

  @Patch(':id/withdraw')
  withdraw(@Param('id') id: string, @Req() req: any) {
    return this.applicationService.withdraw(id, req.user.userId);
  }

  @Patch(':id/accept')
  accept(@Param('id') id: string, @Req() req: any) {
    return this.applicationService.accept(id, req.user.userId);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Req() req: any) {
    return this.applicationService.reject(id, req.user.userId);
  }
}
