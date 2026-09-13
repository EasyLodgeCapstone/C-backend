import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from 'config/configuration';
import { AuthModule } from './Client/auth/auth.module';
import { AdminAuthModule } from './Admin/admin-auth/admin-auth.module';
import { ProductsModule } from './Admin/products/products.module';
import { AccountModule } from './Admin/account/account.module';
import { DashboardModule } from './Client/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { HealthController } from './health/health.controller';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
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
    ScheduleModule.forRoot(),
    AdminAuthModule,
    ProductsModule,
    AccountModule,
    AuthModule,
    DashboardModule,
    CronModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
