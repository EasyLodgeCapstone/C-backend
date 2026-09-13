import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ClientAuthGuard } from '../client-auth/client-auth.guard';
import { Request } from 'express';
import { SigninAuthDto } from './dto/signin.auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('signin')
  signin(@Body() SigninAuthDto: SigninAuthDto) {
    return this.authService.signin(SigninAuthDto);
  }

  @UseGuards(ClientAuthGuard)
  @Get('verify')
  verify(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.authService.verify(userId);
  }
}
