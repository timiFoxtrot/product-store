import { controller, httpGet } from 'inversify-express-utils';
import { Request, Response } from 'express';

@controller('/health')
export class HealthController {
  @httpGet('/')
  public async get(req: Request, res: Response) {
    return res.status(200).json({ status: 'success', message: 'Service is Running' });
  }
}