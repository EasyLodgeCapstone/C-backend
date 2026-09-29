import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ClientAuthGuard } from '../client-auth/client-auth.guard';
import { SigninAuthDto } from './dto/signin.auth';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('CLIENT_AUTH_SERVICE') private authService: ClientProxy,
  ) {}

  @Post('signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.send({ cmd: 'client_signup' }, createAuthDto);
  }

  @Post('signin')
  signin(@Body() SigninAuthDto: SigninAuthDto, @Req() req: Request) {
    return this.authService.send(
      { cmd: 'client_signin' },
      {
        ...SigninAuthDto,
        ipAddress: (req as Request & { ip?: string }).ip,
        userAgent: req.headers['user-agent'] as string | undefined,
      },
    );
  }

  @UseGuards(ClientAuthGuard)
  @Get('verify')
  verify(@Req() req: Request & { user: { sub: string } }) {
    const userId = req.user.sub;
    return this.authService.send({ cmd: 'client_verify' }, userId);
  }
}
