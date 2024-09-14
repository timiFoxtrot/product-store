import { inject, injectable } from 'inversify';
import { IProduct } from '../models/products.model';
import { ProductRepository } from '../repositories/products.repository';
import MODULE_IDENTIFIERS from '../common/config/identifiers';

@injectable()
export class ProductService {
  constructor(
    @inject(MODULE_IDENTIFIERS.ProductRepository) private productRepository: ProductRepository,
  ) {}

  async create(product: IProduct): Promise<IProduct> {
    return this.productRepository.create(product);
  }
}
