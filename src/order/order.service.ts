import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('products').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('products')
      .exec();
    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async remove(id: string): Promise<Order> {
    const deleted = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Pedido não encontrado');
    return deleted;
  }
}
