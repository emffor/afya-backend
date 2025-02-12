/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  readonly products: string[];

  @IsNotEmpty()
  @IsNumber()
  readonly total: number;
}
