import { Body, Controller, Post, Req, Get, HttpCode, HttpStatus, UnauthorizedException, BadRequestException, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './register.dto';
import { LoginUserDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerData: RegisterUserDto) {
    if (!registerData.password) {
      throw new BadRequestException('Password is required');
    }
    try {
      return await this.authService.register(registerData);
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      if (!loginData.email || !loginData.password) {
        throw new BadRequestException('Credentials are required');
      }
      const { accessToken, refreshToken, role, documentId } = await this.authService.login(loginData);
      // Enviar tokens como cookies HTTP-only
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return { message: 'Login successful', role, documentId };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    // Leer accessToken de cookies
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = this.jwtService.verify(token);
      return { authenticated: true, payload };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return await this.authService.logout(req);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    // Leer refreshToken de cookies si no viene en el body
    const token = refreshToken || (arguments[1] && arguments[1].req && arguments[1].req.cookies['refreshToken']);
    if (!token) {
      throw new UnauthorizedException('No refresh token provided');
    }
    try {
      const oldPayload = this.jwtService.verify(token);
      const user = await this.authService.findUserByEmail(oldPayload.email);
      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException('Refresh token inválido');
      }
      const { iat, exp, nbf, ...payload } = oldPayload;
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      // Setear nuevo accessToken en cookie
      const res = (arguments[1] && arguments[1].res) || (arguments[0] && arguments[0].res);
      if (res) {
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000,
        });
      }
      return { message: 'Token refreshed' };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}