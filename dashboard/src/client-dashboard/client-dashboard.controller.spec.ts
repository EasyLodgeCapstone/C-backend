import { Test, TestingModule } from '@nestjs/testing';
import { ClientDashboardController } from './client-dashboard.controller';
import { ClientDashboardService } from './client-dashboard.service';

describe('ClientDashboardController', () => {
  let controller: ClientDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientDashboardController],
      providers: [ClientDashboardService],
    }).compile();

    controller = module.get<ClientDashboardController>(
      ClientDashboardController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
