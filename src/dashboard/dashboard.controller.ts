import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardFilterDto } from './dto/dashboard-filters.dto';
import { OrdersByPeriod } from './interfaces/orders-by-period.interface';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getMetrics(@Query() filter: DashboardFilterDto) {
    return this.dashboardService.getMetrics(filter);
  }

  @Get('orders-by-period')
  async getOrdersByPeriod(@Query('period') period: string): Promise<OrdersByPeriod[]> {
    return this.dashboardService.getOrdersByPeriod(period);
  }
}
