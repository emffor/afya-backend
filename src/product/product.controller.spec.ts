/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
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

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findAll when fetching products', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching a product', async () => {
    const product = { _id: 'product_id', name: 'Smartphone', price: 2500 };
    jest.spyOn(service, 'findOne').mockResolvedValue(product as any);

    expect(await controller.findOne('product_id')).toEqual(product);
    expect(service.findOne).toHaveBeenCalledWith('product_id');
  });
});
