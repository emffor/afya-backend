import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Product } from '../product/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }],
    required: true,
  })
  products: Product[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: Date.now })
  orderDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
