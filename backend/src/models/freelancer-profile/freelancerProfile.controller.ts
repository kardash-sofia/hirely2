import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/jwt/jwt-auth.guard';
import { FreelancerProfileService } from './freelancerProfile.service';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';

@Controller('freelancerProfile')
@UseGuards(JwtAuthGuard)
export class FreelancerProfileController {
  constructor(private readonly freelancerProfileService: FreelancerProfileService) {}

  @Patch(':freelancerId')
  updateFreelancerProfile(
    @Param('freelancerId') freelancerId: string,
    @Body() _dto: UpdateFreelancerProfileDto,
  ) {
    return this.freelancerProfileService.update(freelancerId, _dto);
  }

  @Get('placeholders')
  getPlaceholders() {
    return this.freelancerProfileService.getPlaceholders();
  }
}
