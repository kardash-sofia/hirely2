import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { AuthUser } from '../auth/entities/auth.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateUserDto) {
    const newUser = new User();
    newUser.authUserId = dto.authUserId;
    newUser.fullName = dto.fullName;
    newUser.role = dto.role;

    return await newUser.save();
  }

  async findByAuthUserId(authUserId: string) {
    return await User.findOne({ where: { authUserId } });
  }

  async getById(id: string) {
    const user = await User.findOne({
      where: { id },
      relations: ['ownedProjects', 'executedProjects', 'profile'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    const authUser = await AuthUser.findOne({ where: { id: user.authUserId } });
    return {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      email: authUser?.email || null,
      avatar_url: user.avatar_url || null,
      profile: user.profile || null,
      ownedProjects: user.ownedProjects || [],
      executedProjects: user.executedProjects || [],
    };
  }
}
