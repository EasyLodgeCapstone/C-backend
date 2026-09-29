import { Test, TestingModule } from '@nestjs/testing';
import { ClientDashboardService } from './client-dashboard.service';

describe('ClientDashboardService', () => {
  let service: ClientDashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientDashboardService],
    }).compile();

    service = module.get<ClientDashboardService>(ClientDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
