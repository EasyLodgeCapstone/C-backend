import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './health/health.controller';
import { Cart } from './cart-entities/cart.entity';
import { Product } from './product-entities/product.entity';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    }),
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

    TypeOrmModule.forFeature([Cart, Product]),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
  ],
})
export class AppModule {}
