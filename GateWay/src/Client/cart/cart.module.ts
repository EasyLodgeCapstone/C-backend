import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
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
        name: 'CART_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('CLOUDAMQP_URL')!],
            queue: 'cart_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [CartController],
})
export class CartModule {}
