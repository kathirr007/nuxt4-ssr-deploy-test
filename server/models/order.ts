import mongoose, { Document, Schema, Model } from 'mongoose';
import deepPopulatePlugin from 'mongoose-deep-populate';
import User from '~~/server/models/user';
import Product from '~~/server/models/product';

const deepPopulate = deepPopulatePlugin(mongoose);

interface IProduct {
  productID: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  owner: mongoose.Types.ObjectId;
  products: IProduct[];
  estimatedDelivery: string;
}

const OrderSchema = new Schema<IOrder>({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      productID: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  estimatedDelivery: String
});

OrderSchema.plugin(deepPopulate);

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
export { IOrder, Order };