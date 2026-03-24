import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

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
}
