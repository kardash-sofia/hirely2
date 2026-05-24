import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FreelancerProfile } from 'src/models/freelancer-profile/entities/freelancer-profile.entity';
import { In } from 'typeorm';
import { UpdateFreelancerProfileDto } from './dto/update-freelancer-profile.dto';
import { Skill } from '../skill/entities/skill.entity';
import { Category } from '../category/entities/category.entity';
import { Technology } from '../technology/entities/technology.entity';

@Injectable()
export class FreelancerProfileService {
  constructor(private readonly dataSource: DataSource) {}

  async create({ userId }: { userId: string }) {
    const newProfile = new FreelancerProfile();
    newProfile.userId = userId;
    return await this.dataSource.getRepository(FreelancerProfile).save(newProfile);
  }

  async update(profileId: string, dto: UpdateFreelancerProfileDto) {
    const profileRepo = this.dataSource.getRepository(FreelancerProfile);

    const profile = await profileRepo.findOne({
      where: { id: profileId },
      relations: ['skills', 'categories', 'technologies'],
    });

    if (!profile) {
      throw new Error('Freelancer profile not found');
    }

    if (dto.bio !== undefined) profile.bio = dto.bio;
    if (dto.hourlyRate !== undefined) profile.hourlyRate = dto.hourlyRate;
    if (dto.location !== undefined) profile.location = dto.location;
    if (dto.experienceLevel !== undefined) profile.experienceLevel = dto.experienceLevel;

    const em = this.dataSource.manager;

    if (dto.skillIds) {
      profile.skills = await em.find(Skill, {
        where: { id: In(dto.skillIds) },
      });
    }

    if (dto.categoryIds) {
      profile.categories = await em.find(Category, {
        where: { id: In(dto.categoryIds) },
      });
    }

    if (dto.technologyIds) {
      profile.technologies = await em.find(Technology, {
        where: { id: In(dto.technologyIds) },
      });
    }

    return await profileRepo.save(profile);
  }

  async getPlaceholders() {
    const skills = await this.dataSource.getRepository(Skill).find();
    const categories = await this.dataSource.getRepository(Category).find();
    const technologies = await this.dataSource.getRepository(Technology).find();

    return {
      skills,
      categories,
      technologies,
    };
  }
}
