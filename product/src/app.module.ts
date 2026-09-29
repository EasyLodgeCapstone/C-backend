import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './health/health.controller';
import { CronModule } from './cron/cron.module';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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

    TypeOrmModule.forFeature([Product]),

    CronModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
