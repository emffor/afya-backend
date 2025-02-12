/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create when creating an order', async () => {
    const createOrderDto = { products: ['product_id'], total: 5000 };
    jest.spyOn(service, 'create').mockResolvedValue(createOrderDto as any);

    expect(await controller.create(createOrderDto as any)).toEqual(
      createOrderDto,
    );
    expect(service.create).toHaveBeenCalledWith(createOrderDto);
  });

  it('should call service.findAll when fetching orders', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching an order', async () => {
    const order = { _id: 'order_id', products: ['product_id'], total: 5000 };
    jest.spyOn(service, 'findOne').mockResolvedValue(order as any);

    expect(await controller.findOne('order_id')).toEqual(order);
    expect(service.findOne).toHaveBeenCalledWith('order_id');
  });

  it('should call service.update when updating an order', async () => {
    const updateOrderDto: UpdateOrderDto = { total: 6000 };
    const updatedOrder = {
      _id: 'order_id',
      products: ['product_id'],
      total: 6000,
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedOrder as any);

    expect(await controller.update('order_id', updateOrderDto)).toEqual(
      updatedOrder,
    );
    expect(service.update).toHaveBeenCalledWith('order_id', updateOrderDto);
  });

  it('should call service.remove when deleting an order', async () => {
    const order = { _id: 'order_id', products: ['product_id'], total: 5000 };
    jest.spyOn(service, 'remove').mockResolvedValue(order as any);

    expect(await controller.remove('order_id')).toEqual(order);
    expect(service.remove).toHaveBeenCalledWith('order_id');
  });
});
