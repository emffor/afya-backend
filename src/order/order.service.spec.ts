import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from './order.schema';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
