/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { S3Service } from '../aws/s3.service';
import { File } from 'multer';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;
  let s3Service: S3Service;

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
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('http://fake-s3-url.com/my-bucket/image.jpg'),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findAll when fetching products', async () => {
    jest.spyOn(productService, 'findAll').mockResolvedValue([]);
    expect(await controller.findAll()).toEqual([]);
    expect(productService.findAll).toHaveBeenCalled();
  });

  it('should call service.findOne when fetching a product', async () => {
    const product = { _id: 'product_id', name: 'Smartphone', price: 2500 };
    jest.spyOn(productService, 'findOne').mockResolvedValue(product as any);
    expect(await controller.findOne('product_id')).toEqual(product);
    expect(productService.findOne).toHaveBeenCalledWith('product_id');
  });

  it('should call s3Service.uploadFile when uploading an image', async () => {
    const fakeFile = {
      buffer: Buffer.from('fake-image-content'),
      originalname: 'image.jpg',
    } as File;

    const result = await controller.uploadImage(fakeFile);
    expect(result).toEqual({ imageUrl: 'http://fake-s3-url.com/my-bucket/image.jpg' });
    expect(s3Service.uploadFile).toHaveBeenCalled();
    const callArgs = (s3Service.uploadFile as jest.Mock).mock.calls[0];
    expect(callArgs[0]).toBe(fakeFile.buffer);
    expect(callArgs[1]).toMatch(new RegExp(`^[0-9]+-image\\.jpg$`));
    expect(callArgs[2]).toBe(fakeFile.mimetype);
  });
});
