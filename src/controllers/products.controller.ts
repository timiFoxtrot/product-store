import { controller, httpDelete, httpGet, httpPatch, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import MODULE_IDENTIFIERS from '../common/config/identifiers';
import { ProductService } from '../services/products.service';
import { Request, Response } from 'express';
import { productSchema } from '../common/validator';

@controller('/products')
export class ProductController {
  constructor(@inject(MODULE_IDENTIFIERS.ProductService) private productService: ProductService) {}

  @httpPost('/')
  async createProduct(req: Request, res: Response) {
    try {
      const { error } = productSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          details: error.details.map((err) => err.message),
        });
      }
      
      const result = await this.productService.create(req.body, req.user);
      return res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  @httpGet('/all')
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit } = req.query as unknown as { page: string; limit: string };
      const result = await this.productService.getAll({ page: Number(page), limit: Number(limit) });
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  @httpGet('/')
  async getAllProductsByUser(req: Request, res: Response) {
    try {
      const result = await this.productService.getAllProductsByUser(req.user);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  @httpGet('/:id')
  async getProduct(req: Request, res: Response) {
    try {
      const result = await this.productService.getProduct(req.params.id, req.user);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      res.status(error.statusCode || 400).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @httpPatch('/update/:id')
  async updateProduct(req: Request, res: Response) {
    try {
      const result = await this.productService.updateProduct(req.params.id, req.body, req.user);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  @httpDelete('/remove/:id')
  async deleteProduct(req: Request, res: Response) {
    try {
      const result = await this.productService.deleteProduct(req.params.id, req.user);
      return res.status(200).json({ status: 'deleted', data: result });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}
