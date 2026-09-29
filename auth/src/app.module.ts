import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { HealthController } from './health/health.controller';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';

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

    AdminModule,

    ClientModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
