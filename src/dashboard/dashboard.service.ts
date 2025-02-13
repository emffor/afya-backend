import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../order/order.schema';
import { Model } from 'mongoose';
import { DashboardFilterDto } from './dto/dashboard-filters.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async getMetrics(filter: DashboardFilterDto): Promise<any> {
    const pipeline: any[] = [];
    const match: any = {};

    if (filter.startDate || filter.endDate) {
      match.orderDate = {};
      if (filter.startDate) {
        match.orderDate.$gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        match.orderDate.$lte = new Date(filter.endDate);
      }
    }

    if (filter.productId) {
      match.products = filter.productId;
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    if (filter.categoryId) {
      pipeline.push({
        $lookup: {
          from: 'products', 
          localField: 'products',
          foreignField: '_id',
          as: 'productDetails',
        },
      });
      pipeline.push({
        $match: {
          'productDetails.categoryIds': filter.categoryId,
        },
      });
    }

    pipeline.push({
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
      },
    });

    const result = await this.orderModel.aggregate(pipeline);
    return result[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
  }
}