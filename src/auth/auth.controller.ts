import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { RefreshAuthGuard } from '../common/guards/refresh-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User as PrismaUser } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';
import type { JwtUserPayload } from 'src/common/types/jwt.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.register(dto, res);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(dto.email, dto.password, res);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(
    @User() user: PrismaUser | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.refresh(
      {
        id: user?.id as string,
        email: user?.email as string,
      },
      res,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@User() user: JwtUserPayload) {
    if (!user) throw new UnauthorizedException();

    const fullUser = await this.users.findById(user.id);
    if (!fullUser) throw new UnauthorizedException();

    return this.users.sanitize(fullUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.auth.logout(res);
  }
}
