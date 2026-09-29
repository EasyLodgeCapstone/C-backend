import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { clientUser } from './entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientAuthAudit } from './entities/auth-audit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([clientUser, ClientAuthAudit]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.clientJwt'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
