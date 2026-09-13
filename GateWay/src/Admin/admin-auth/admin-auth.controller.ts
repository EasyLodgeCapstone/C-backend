import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { signupDto } from './Dto/signupDto';
import { signinDto } from './Dto/signinDto';
import { AuthGuard } from 'src/Admin/auth/auth.guard';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body(new ValidationPipe()) signupDto: signupDto) {
    console.log(signupDto);
    return this.adminAuthService.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body(new ValidationPipe()) signinDto: signinDto) {
    return this.adminAuthService.signin(signinDto);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.adminAuthService.verify(userId);
  }
}
