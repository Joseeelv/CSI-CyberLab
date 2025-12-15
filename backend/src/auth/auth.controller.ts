import { Body, Controller, Post, Req, Res, Get, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerData: RegisterUserDto) {
    if (!registerData.password) {
      throw new Error('Password is required');
    }
    return this.authService.register(registerData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginData: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, role } = await this.authService.login(loginData.email, loginData.password);
    // Set cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600000,
    });
    return { message: 'Login successful', accessToken, role };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() req: Request) {
    const token = req.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException('No token');
    }
    try {
      const payload = this.jwtService.verify(token);
      return { authenticated: true, payload };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<any> {
    try {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
      return { message: 'Logout successful' };
    } catch (error) {
      return { error: error.message };
    }
  }
}