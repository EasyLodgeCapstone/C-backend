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
  signin(
    @Body(new ValidationPipe()) signinDto: signinDto,
    @Req() req: Request,
  ) {
    return this.adminService.send(
      { cmd: 'admin_sign_in' },
      {
        ...signinDto,
        ipAddress: (req as Request & { ip?: string }).ip,
        userAgent: req.headers['user-agent'] as string | undefined,
      },
    );
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.adminService.send({ cmd: 'admin_verify' }, userId);
  }
}
