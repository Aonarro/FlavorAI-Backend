import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  private cookieOptions = {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: false,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  async register(dto: RegisterDto, res: Response) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password: hashedPassword });
    const tokens = await this.generateTokens(user.id, user.email);

    this.setRefreshCookie(res, tokens.refreshToken);
    return { user: this.users.sanitize(user), accessToken: tokens.accessToken };
  }

  async login(email: string, password: string, res: Response) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.generateTokens(user.id, user.email);
    this.setRefreshCookie(res, tokens.refreshToken);

    return { user: this.users.sanitize(user), accessToken: tokens.accessToken };
  }

  async refresh(payload: { id: string; email: string }, res: Response) {
    const tokens = await this.generateTokens(payload.id, payload.email);
    this.setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  logout(res: Response) {
    this.clearRefreshCookie(res);
    return { message: 'Logged out' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private setRefreshCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, this.cookieOptions);
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie('refresh_token', this.cookieOptions);
  }
}
