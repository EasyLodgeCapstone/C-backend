import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { signupDto } from './Dto/signupDto';
import { signinDto } from './Dto/signinDto';
import { AuthGuard } from 'src/Admin/auth/auth.guard';
import { ClientProxy } from '@nestjs/microservices';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(
    @Inject('ADMIN_AUTH_SERVICE') private adminService: ClientProxy,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body(new ValidationPipe()) signupDto: signupDto) {
    return this.adminService.send({ cmd: 'admin_sign_up' }, signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body(new ValidationPipe()) signinDto: signinDto) {
    return this.adminService.send({ cmd: 'admin_sign_in' }, signinDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.adminService.send({ cmd: 'admin_verify' }, userId);
  }
}
