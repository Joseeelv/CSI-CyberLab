import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  Delete,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './register.dto';
import { LoginUserDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerData: RegisterUserDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { accessToken, role } = await this.authService.login(
      loginData.email,
      loginData.password,
      userAgent,
    );

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });

    return {
      message: 'Login successful',
      accessToken,
      role,
    };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      return {
        authenticated: true,
        user: payload,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Delete('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('No active session');
    }

    await this.authService.logout(token);

    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logout successful' };
  }
}