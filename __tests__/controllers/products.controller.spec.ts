import 'reflect-metadata';
import { Request, Response } from 'express';
import { ProductService } from '../../src/services/products.service';
import { ProductController } from '../../src/controllers/products.controller';
import { mock, MockProxy } from 'jest-mock-extended';
import { IUser } from '../../src/models/users.model';
import { IProduct } from '../../src/models/products.model';

interface RequestWithUser extends Request {
  user: IUser;
}

describe('ProductController', () => {
  let productController: ProductController;
  let productService: MockProxy<ProductService>;
  let req: Partial<RequestWithUser>;
  let res: Partial<Response>;

  beforeEach(() => {
    productService = mock<ProductService>();
    productController = new ProductController(productService);

    req = { user: { _id: 'user-id', email: 'test@example.com' } as IUser };
    res = {
      status: jest.fn().mockReturnThis(), // Mock status
      json: jest.fn(), // Mock json
    };
  });

  it('should create a new product', async () => {
    const mockReq = {
      body: {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
      },
      user: { _id: 'user-id', email: 'test@example.com' },
    } as RequestWithUser;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the service method to return the created product
    productService.create.mockResolvedValueOnce({
      ...mockReq.body,
      _id: 'product-id',
      owner: mockReq.user._id,
    });

    await productController.createProduct(mockReq, mockRes);

    expect(productService.create).toHaveBeenCalledWith(mockReq.body, mockReq.user);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        ...mockReq.body,
        _id: 'product-id',
        owner: mockReq.user._id,
      },
    });
  });

  it('should get all products', async () => {
    const products = [{ name: 'Product1' }, { name: 'Product2' }] as unknown as (Partial<Document> & IProduct)[];
    productService.getAll.mockResolvedValue({
      total: 2,
      page: 1,
      limit: 2,
      totalPages: 1,
      data: products,
    });

    req.query = { page: '1', limit: '2' };

    await productController.getAll(req as Request, res as Response);

    expect(productService.getAll).toHaveBeenCalledWith({ page: 1, limit: 2 });

    // Check that res.json is called with the expected value
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: { total: 2, page: 1, limit: 2, totalPages: 1, data: products },
    });
  });

  it('should get products by user', async () => {
    const products = [{ name: 'Product1' }, { name: 'Product2' }] as unknown as (Partial<Document> & IProduct)[];
    productService.getAllProductsByUser.mockResolvedValue(products);

    await productController.getAllProductsByUser(req as Request, res as Response);
    expect(productService.getAllProductsByUser).toHaveBeenCalledWith(req.user);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: products });
  });

  it('should get a product by id', async () => {
    const product = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      owner: req.user?._id,
    } as unknown as Partial<Document> & IProduct;
    productService.getProduct.mockResolvedValue(product);

    req.params = { id: 'product-id' };

    await productController.getProduct(req as Request, res as Response);
    expect(productService.getProduct).toHaveBeenCalledWith('product-id', req.user);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: product });
  });

  it('should update a product', async () => {
    const updatedProduct = { name: 'Updated Product' } as unknown as Partial<Document> & IProduct;
    productService.updateProduct.mockResolvedValue(updatedProduct);

    req.params = { id: 'product-id' };
    req.body = updatedProduct;

    await productController.updateProduct(req as Request, res as Response);
    expect(productService.updateProduct).toHaveBeenCalledWith('product-id', updatedProduct, req.user);
    expect(res.json).toHaveBeenCalledWith({ status: 'success', data: updatedProduct });
  });

  it('should delete a product', async () => {
    const product = { name: 'Test Product' } as unknown as Partial<Document> & IProduct;
    productService.deleteProduct.mockResolvedValue(product);

    req.params = { id: 'product-id' };

    await productController.deleteProduct(req as Request, res as Response);
    expect(productService.deleteProduct).toHaveBeenCalledWith('product-id', req.user);
    expect(res.json).toHaveBeenCalledWith({ status: 'deleted', data: product });
  });
});
