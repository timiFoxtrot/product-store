import { injectable } from 'inversify';
import Product, { IProduct } from '../models/products.model';

@injectable()
export class ProductRepository {
  async create(product: IProduct): Promise<IProduct> {
    const newProduct = new Product(product);
    return await newProduct.save();
  }
}
