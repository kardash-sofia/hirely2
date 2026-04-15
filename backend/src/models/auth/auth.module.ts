import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from '../../common/jwt/jwt.strategy';
import { AuthUser } from './entities/auth.entity';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { FreelancerProfileService } from '../freelancer-profile/freelancerProfile.service';
import { FreelancerProfile } from '../freelancer-profile/entities/freelancer-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser, User, FreelancerProfile]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FreelancerProfileService],
  exports: [JwtModule],
})
export class AuthModule {}
