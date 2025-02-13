import { IsOptional, IsString } from 'class-validator';

export class DashboardFilterDto {
  @IsOptional()
  @IsString()
  startDate?: string; 

  @IsOptional()
  @IsString()
  endDate?: string; 

  @IsOptional()
  @IsString()
  productId?: string; 

  @IsOptional()
  @IsString()
  categoryId?: string; 
}
