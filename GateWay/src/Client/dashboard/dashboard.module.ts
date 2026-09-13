import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/Admin/products/entities/product.entity';
import { Account } from 'src/Admin/account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Account])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
