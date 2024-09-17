import 'reflect-metadata';
import { ProductRepository } from '../../src/repositories/products.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import Product, { IProduct } from '../../src/models/products.model';
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
    const product: IProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      owner: user._id,
    } as IProduct;

    // Mock the save method on the Product instance
    const saveMock = jest.fn().mockResolvedValue({ ...product, _id: 'product-id' });

    // Mock the constructor of Product to return the mocked instance
    const productInstance = { save: saveMock };
    (Product as unknown as jest.Mock).mockImplementation(() => productInstance);

    const result = await repository.create(product, user);
    expect(result).toEqual({ ...product, _id: 'product-id' });
    expect(saveMock).toHaveBeenCalled();
  });

  it('should get all products with pagination', async () => {
    const products = [{ name: 'Product1' }, { name: 'Product2' }];
    const total = 2;

    // Mocking Product.find to return paginated products
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(products),
    });

    // Mocking countDocuments to return total number of products
    (Product.countDocuments as jest.Mock).mockResolvedValueOnce(total);

    const result = await repository.getAll({ page: 1, limit: 2 });

    expect(result.data).toEqual(products);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
  });

  it('should get all products by user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const products = [
      { name: 'Product1', owner: user._id },
      { name: 'Product2', owner: user._id },
    ];

    // Mocking Product.find for getting products by user
    (Product.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValueOnce(products),
    });

    const result = await repository.getAllProductsByUser(user);
    expect(result).toEqual(products);
  });

  it('should get a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id };

    // Mocking Product.findOne to return a specific product by id and user
    (Product.findOne as jest.Mock).mockResolvedValueOnce(product);

    const result = await repository.getProduct('product-id', user);
    expect(result).toEqual(product);
  });

  it('should update a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id };
    const updatedData = { name: 'Updated Product' };

    // Mocking findOneAndUpdate for updating the product
    (Product.findOne as jest.Mock).mockResolvedValueOnce(product);
    (Product.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
      ...product,
      ...updatedData,
    });

    const result = await repository.updateProduct('product-id', updatedData, user);
    expect(result).toEqual({ ...product, ...updatedData });
  });

  it('should delete a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id };

    // Mocking findOneAndDelete for deleting the product
    (Product.findOne as jest.Mock).mockResolvedValueOnce(product);
    (Product.findOneAndDelete as jest.Mock).mockResolvedValueOnce(product);

    const result = await repository.deleteProduct('product-id', user);
    expect(result).toEqual(product);
  });
});
