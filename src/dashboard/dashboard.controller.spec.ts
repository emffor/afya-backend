import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filters.dto';

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getMetrics: jest.fn().mockResolvedValue({
              totalOrders: 3,
              totalRevenue: 1466,
              averageOrderValue: 488.67,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return metrics based on filters', async () => {
    const filters: DashboardFilterDto = {
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    };

    const result = await controller.getMetrics(filters);

    expect(result).toEqual({
      totalOrders: 3,
      totalRevenue: 1466,
      averageOrderValue: 488.67,
    });
    expect(dashboardService.getMetrics).toHaveBeenCalledWith(filters);
  });
});