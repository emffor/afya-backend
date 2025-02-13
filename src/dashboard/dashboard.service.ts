import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../order/order.schema';
import { Model } from 'mongoose';
import { DashboardFilterDto } from './dto/dashboard-filters.dto';
import { OrdersByPeriod } from './interfaces/orders-by-period.interface';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
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

  async getOrdersByPeriod(period: string = 'daily'): Promise<OrdersByPeriod[]> {
    let dateFormat: string;
    if (period === 'daily') {
      dateFormat = "%Y-%m-%d";
    } else if (period === 'weekly') {
      // %U retorna a semana do ano (domingo como primeiro dia)
      dateFormat = "%Y-%U";
    } else if (period === 'monthly') {
      dateFormat = "%Y-%m";
    } else {
      dateFormat = "%Y-%m-%d"; // padrão diário
    }

    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$orderDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }
    ]).exec();

    return result.map(item => ({
      period: item._id,
      count: item.count,
    }));
  }
}
