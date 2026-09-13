import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('fetchSpecProduct')
  findAllSkincare(
    @Query('category') category: string,
    @Query('page') page: number,
  ) {
    return this.dashboardService.findSpecProduct(category, page);
  }

  @Get('fetchAccount')
  getAccount() {
    return this.dashboardService.getAccount();
  }

  @Get('fetchOne')
  findOne(@Query('id') productId: string) {
    return this.dashboardService.findOne(productId);
  }
}
