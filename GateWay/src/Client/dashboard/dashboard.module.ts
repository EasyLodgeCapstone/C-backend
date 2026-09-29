import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'DASHBOARD_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('CLOUDAMQP_URL')!],
            queue: 'dashboard_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [DashboardController],
})
export class DashboardModule {}
