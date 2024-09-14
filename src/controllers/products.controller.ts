import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import MODULE_IDENTIFIERS from '../common/config/identifiers';
import { ProductService } from '../services/products.service';

@controller('/products')
export class ProductController {
  constructor(
    @inject(MODULE_IDENTIFIERS.ProductService) private productService: ProductService
  ) {}

  @httpGet('/')
  public async getUsers(req: any, res: any): Promise<any> {
    const users = await this.productService.create(req.body);
    return res.json(users);
  }
}
