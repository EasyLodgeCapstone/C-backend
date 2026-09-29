import { Module } from '@nestjs/common';
import { ClientDashboardService } from './client-dashboard.service';
import { ClientDashboardController } from './client-dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account-entity/account.entity';
import { Product } from './product-entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Account])],
  controllers: [ClientDashboardController],
  providers: [ClientDashboardService],
})
export class ClientDashboardModule {}
