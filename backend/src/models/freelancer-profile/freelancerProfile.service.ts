import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FreelancerProfile } from 'src/models/freelancer-profile/entities/freelancer-profile.entity';

@Injectable()
export class FreelancerProfileService {
  constructor(private readonly dataSource: DataSource) {}

  async create({ userId }: { userId: string }) {
    const newProfile = new FreelancerProfile();
    newProfile.userId = userId;
    return await this.dataSource.getRepository(FreelancerProfile).save(newProfile);
  }
}
