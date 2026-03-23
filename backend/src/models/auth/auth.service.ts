import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthUser } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new AuthUser();
    user.email = email;
    user.password_hash = hashedPassword;

    await user.save();

    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await AuthUser.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({ sub: user.id });
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    user.refresh_token = await bcrypt.hash(refreshToken, 10);
    await user.save();

    return { accessToken, refreshToken };
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
