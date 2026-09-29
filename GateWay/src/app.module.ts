import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './Client/auth/auth.module';
import { AdminAuthModule } from './Admin/admin-auth/admin-auth.module';
import { ProductsModule } from './Admin/products/products.module';
import { AccountModule } from './Admin/account/account.module';
import { DashboardModule } from './Client/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { HealthController } from './health/health.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { SentryModule } from '@sentry/nestjs/setup';
import { CartModule } from './Client/cart/cart.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    CronModule,
    ScheduleModule.forRoot(),
    AdminAuthModule,
    ProductsModule,
    AccountModule,
    AuthModule,
    DashboardModule,
    CartModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
