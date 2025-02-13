import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { Order } from '../order/order.schema';
import { Model } from 'mongoose';
import { DashboardFilterDto } from './dto/dashboard-filters.dto';

describe('DashboardService', () => {
  let service: DashboardService;
  let orderModel: Model<Order>;

  const mockAggregateResponse = [
    {
      totalOrders: 3,
      totalRevenue: 1466,
      averageOrderValue: 488.67,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            aggregate: jest.fn().mockResolvedValue(mockAggregateResponse),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    orderModel = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return metrics with date filters', async () => {
      const filters: DashboardFilterDto = {
        startDate: '2023-01-01',
        endDate: '2023-01-31',
      };

      const result = await service.getMetrics(filters);

      expect(result).toEqual(mockAggregateResponse[0]);
      expect(orderModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $match: {
              orderDate: {
                $gte: new Date('2023-01-01'),
                $lte: new Date('2023-01-31'),
              },
            },
          },
        ])
      );
    });

    it('should return metrics with product filter', async () => {
      const filters: DashboardFilterDto = {
        productId: '123',
      };

      await service.getMetrics(filters);

      expect(orderModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $match: {
              products: '123',
            },
          },
        ])
      );
    });

    it('should return metrics with category filter', async () => {
      const filters: DashboardFilterDto = {
        categoryId: '456',
      };

      await service.getMetrics(filters);

      expect(orderModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $lookup: {
              from: 'products',
              localField: 'products',
              foreignField: '_id',
              as: 'productDetails',
            },
          },
          {
            $match: {
              'productDetails.categoryIds': '456',
            },
          },
        ])
      );
    });

    it('should return default values when no results found', async () => {
      jest.spyOn(orderModel, 'aggregate').mockResolvedValueOnce([]);

      const result = await service.getMetrics({});

      expect(result).toEqual({
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      });
    });
  });
});