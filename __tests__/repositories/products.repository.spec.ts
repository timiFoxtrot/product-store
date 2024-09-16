import 'reflect-metadata';
import { ProductRepository } from '../../src/repositories/products.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import Product, { IProduct } from '../../src/models/products.model'
import { IUser } from '../../src/models/users.model';

jest.mock('../../src/models/products.model');

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let mockProductModel: MockProxy<typeof Product>;

  beforeEach(() => {
    repository = new ProductRepository();
    mockProductModel = mock<typeof Product>();
    Product.find = mockProductModel.find;
    Product.findOne = mockProductModel.findOne;
    Product.findOneAndUpdate = mockProductModel.findOneAndUpdate;
    Product.countDocuments = mockProductModel.countDocuments;
  });

  it('should create a new product', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product: any = { name: 'Test Product', description: 'Test', price: 100, owner: user._id } as IProduct;

    const savedProduct = { ...product, _id: 'product-id' };
   await mockProductModel.create.mockResolvedValue(savedProduct);

    const result = await repository.create(product, user);
    expect(result).toEqual(savedProduct);
  });

//   it('should get all products with pagination', async () => {
//     const products = [{ name: 'Product1' }, { name: 'Product2' }];
//     const total = 2;

//     mockProductModel.find.mockReturnValue({
//         populate: jest.fn().mockReturnThis(),
//         skip: jest.fn().mockReturnThis(),
//         limit: jest.fn().mockReturnThis(),
//         exec: jest.fn().mockResolvedValue(products), // Make sure to resolve the final result
//       });

//     mockProductModel.countDocuments.mockResolvedValue(total);

//     const result = await repository.getAll({ page: 1, limit: 2 });
//     expect(result.data).toEqual(products);
//     expect(result.total).toBe(total);
//   });
});
