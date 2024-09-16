import { injectable } from 'inversify';
import Product, { IProduct } from '../models/products.model';
import { IUser } from '../models/users.model';

@injectable()
export class ProductRepository {
  async create(product: IProduct, user: IUser) {
    const userId = user._id;
    const newProduct = new Product({ ...product, owner: userId });
    return await newProduct.save();
  }

  async getAll({ page, limit }: { page: number; limit: number }) {
    page = page || 1;
    limit = limit || 5;

    const skip = (page - 1) * limit;
    const products = await Product.find().populate('owner', '-password').skip(skip).limit(limit).exec();
    const total = await Product.countDocuments();
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: products,
    };
  }

  async getAllProductsByUser(user: IUser) {
    const products = await Product.find({ owner: user._id }).populate('owner', '-password').exec();
    return products;
  }

  async getProduct(id: string, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id });
    if (!product) throw { message: 'Product not found', statusCode: 404 };
    return product;
  }

  async updateProduct(id: string, data: Partial<IProduct>, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id });
    if (!product) throw { message: 'Product not found', statusCode: 404 };
    const updatedProduct = await Product.findOneAndUpdate({ _id: id, owner: user._id }, data, {
      returnDocument: 'after',
    });
    return updatedProduct;
  }

  async deleteProduct(id: string, user: IUser) {
    const product = await Product.findOne({ _id: id, owner: user._id });
    if (!product) throw { message: 'Product not found', statusCode: 404 };
    const deletedProduct = await Product.findOneAndDelete({ _id: id, owner: user._id });
    return deletedProduct;
  }
}
