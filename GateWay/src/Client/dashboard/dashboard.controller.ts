import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject('DASHBOARD_SERVICE') private dashboardService: ClientProxy,
  ) {}

  @Get('fetchSpecProduct')
  findAllSkincare(
    @Query('category') category: string,
    @Query('page') page: number,
  ) {
    const query = {
      category,
      page: Number(page),
    };
    return this.dashboardService.send({ cmd: 'fetch_Spec_Product' }, query);
  }

  @Get('fetchAccount')
  getAccount() {
    return this.dashboardService.send({ cmd: 'fetch_account' }, '1');
  }

  @Get('fetchOne')
  findOne(@Query('id') productId: string) {
    return this.dashboardService.send({ cmd: 'fetch_one' }, productId);
  }
}
