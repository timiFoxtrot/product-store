import { inject, injectable } from 'inversify';
import { IProduct } from '../models/products.model';
import { ProductRepository } from '../repositories/products.repository';
import MODULE_IDENTIFIERS from '../common/config/identifiers';
import { IUser } from '../models/users.model';

@injectable()
export class ProductService {
  constructor(
    @inject(MODULE_IDENTIFIERS.ProductRepository) private productRepository: ProductRepository,
  ) {}

  async create(product: IProduct, user: IUser): Promise<IProduct> {
    return this.productRepository.create(product, user);
  }

  async getAll({page, limit}: {page: number, limit: number}) {
    return this.productRepository.getAll({page, limit})
  }

  async getAllProductsByUser(user: IUser) {
    return this.productRepository.getAllProductsByUser(user)
  } 

  async getProduct(id: string, user: IUser) {
    return this.productRepository.getProduct(id, user)
  }

  async updateProduct(id: string, data: Partial<IProduct>, user: IUser) {
    return this.productRepository.updateProduct(id, data, user)
  }

  async deleteProduct(id: string, user: IUser) {
    return this.productRepository.deleteProduct(id, user)
  }
}
