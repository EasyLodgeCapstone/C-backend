import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.CLIENT_JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'CLIENT_AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('CLOUDAMQP_URL')!],
            queue: 'client_auth_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
