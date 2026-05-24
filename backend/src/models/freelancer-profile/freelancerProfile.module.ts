import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FreelancerProfileService } from './freelancerProfile.service';
import { FreelancerProfileController } from './freelancerProfile.controller';
import { FreelancerProfile } from 'src/models/freelancer-profile/entities/freelancer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FreelancerProfile])],
  controllers: [FreelancerProfileController],
  providers: [FreelancerProfileService],
})
export class FreelancerProfileModule {}
