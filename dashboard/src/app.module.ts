import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientDashboardModule } from './client-dashboard/client-dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('database.host');
        return {
          type: 'mongodb',
          url: uri,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          useUnifiedTopology: true,
          connectTimeoutMS: 30000, // time to establish initial connection
          socketTimeoutMS: 45000, // time before an idle socket is closed
          serverSelectionTimeoutMS: 30000, // time to find a suitable server (this is likely your relevant one)
          retryWrites: true,
        };
      },
    }),
    CronModule,
    ClientDashboardModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
