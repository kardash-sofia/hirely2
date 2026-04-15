import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './entities/auth.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Roles } from '../user/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(email: string, password: string, fullName: string, role: string) {
    const existingUser = await AuthUser.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const authUser = new AuthUser();
    authUser.email = email;
    authUser.password_hash = hashedPassword;

    await authUser.save();

    const user = await this.userService.create({
      authUserId: authUser.id,
      fullName: fullName,
      role: role as Roles,
    } as CreateUserDto);

    await user.save();

    return { success: true, message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const authUser = await AuthUser.findOne({ where: { email } });
    if (!authUser) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, authUser.password_hash);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const user = await this.userService.findByAuthUserId(authUser.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    authUser.refresh_token = await bcrypt.hash(refreshToken, 10);
    await authUser.save();

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, fullName: user.fullName, email: authUser.email, role: user.role },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await AuthUser.findOne({ where: { id: userId } });
    if (!user || !user.refresh_token) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isValid) throw new UnauthorizedException();

    const newAccessToken = this.jwtService.sign({ sub: user.id });
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    user.refresh_token = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    const user = await AuthUser.findOne({ where: { id: userId } });
    if (!user) return;
    user.refresh_token = 'null';
    await user.save();
  }
}
