import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.adminSecret'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
