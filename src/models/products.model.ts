import { Schema, Document, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  owner: string;
}

const ProductSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: String, ref: 'User', required: true },
  },
  {
    _id: false,
    id: false,
    toJSON: {
      virtuals: true,
      versionKey: false
    },
  },
);

const Product = model<IProduct>('Product', ProductSchema);
export default Product;
