import 'reflect-metadata';
import { mock, MockProxy } from 'jest-mock-extended';
import { Document } from 'mongoose';
import { ProductService } from '../../src/services/products.service';
import { ProductRepository } from '../../src/repositories/products.repository';
import { IProduct } from '../../src/models/products.model';
import { IUser } from '../../src/models/users.model';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: MockProxy<ProductRepository>;

  beforeEach(() => {
    productRepository = mock<ProductRepository>();
    productService = new ProductService(productRepository);
  });

  it('should create a new product', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product: IProduct = {
      _id: 'product-id',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      owner: user._id,
    } as IProduct;

    // Mock Mongoose Document for the Product model
    const productDocumentMock = {
      ...product,
      _id: 'product-id',
    } as unknown as Partial<Document> & IProduct;

    // Mock the repository to return the mock document
    productRepository.create.mockResolvedValue(productDocumentMock);

    const result = await productService.create(product, user);

    expect(result).toEqual({ ...product, _id: 'product-id' });
    expect(productRepository.create).toHaveBeenCalledWith(product, user);
  });

  it('should get all products with pagination', async () => {
    const products = [{ name: 'Product1' }, { name: 'Product2' }] as unknown as (Partial<Document> & IProduct)[];
    const total = 2;

    productRepository.getAll.mockResolvedValue({
      total,
      page: 1,
      limit: 2,
      totalPages: 1,
      data: products,
    });

    const result = await productService.getAll({ page: 1, limit: 2 });
    expect(result.data).toEqual(products);
    expect(result.total).toBe(total);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
  });

  it('should get products by user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const products = [{ name: 'Product1' }, { name: 'Product2' }] as unknown as (Partial<Document> & IProduct)[];

    productRepository.getAllProductsByUser.mockResolvedValue(products);

    const result = await productService.getAllProductsByUser(user);
    expect(result).toEqual(products);
  });

  it('should get a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id } as unknown as Partial<Document> &
      IProduct;

    productRepository.getProduct.mockResolvedValue(product);

    const result = await productService.getProduct('product-id', user);
    expect(result).toEqual(product);
  });

  it('should update a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const updatedData = { name: 'Updated Product' };
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id } as unknown as Partial<Document> &
      IProduct;

    productRepository.updateProduct.mockResolvedValue({ ...product, ...updatedData });

    const result = await productService.updateProduct('product-id', updatedData, user);
    expect(result).toEqual({ ...product, ...updatedData });
  });

  it('should delete a product by id and user', async () => {
    const user: IUser = { _id: 'user-id', email: 'test@example.com' } as IUser;
    const product = { _id: 'product-id', name: 'Test Product', owner: user._id } as unknown as Partial<Document> &
      IProduct;

    productRepository.deleteProduct.mockResolvedValue(product);

    const result = await productService.deleteProduct('product-id', user);
    expect(result).toEqual(product);
  });
});
