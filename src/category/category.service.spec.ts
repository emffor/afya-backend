/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findAll when fetching categories', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching a category', async () => {
    const category = {
      _id: 'category_id',
      name: 'Eletrônicos',
      description: 'Gadgets',
    };
    jest.spyOn(service, 'findOne').mockResolvedValue(category as any);

    expect(await controller.findOne('category_id')).toEqual(category);
    expect(service.findOne).toHaveBeenCalledWith('category_id');
  });
});
