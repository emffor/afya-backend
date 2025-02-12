/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from './order.schema';
import { Model } from 'mongoose';

describe('OrderService', () => {
  let service: OrderService;
  let model: Model<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              save: jest.fn().mockResolvedValue(dto),
            })),
            find: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([]),
              }),
            }),
            findById: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
              }),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
              }),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(null),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const createOrderDto = { products: ['product_id'], total: 5000 };
    const savedOrder = { _id: 'order_id', ...createOrderDto };

    jest.spyOn(model, 'create').mockResolvedValue(savedOrder as any);

    const result = await service.create(createOrderDto as any);
    expect(result).toEqual(savedOrder);
    expect(model.create).toHaveBeenCalledWith(createOrderDto);
  });

  it('should return all orders', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    expect(await service.findAll()).toEqual([]);
  });

  it('should return an order by ID', async () => {
    const order = { _id: 'order_id', products: ['product_id'], total: 5000 };

    jest.spyOn(model, 'findById').mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(order),
      }),
    } as any);

    expect(await service.findOne('order_id')).toEqual(order);
  });

  it('should update an order', async () => {
    const updateOrderDto = { total: 6000 };
    const updatedOrder = {
      _id: 'order_id',
      products: ['product_id'],
      total: 6000,
    };

    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedOrder),
      }),
    } as any);

    expect(await service.update('order_id', updateOrderDto)).toEqual(
      updatedOrder,
    );
  });

  it('should delete an order', async () => {
    const order = { _id: 'order_id', products: ['product_id'], total: 5000 };

    jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValue(order),
    } as any);

    expect(await service.remove('order_id')).toEqual(order);
  });
});
