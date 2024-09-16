import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserService } from '../services/users.service';
import MODULE_IDENTIFIERS from '../common/config/identifiers';
import { Request, Response } from 'express';
import { userSchema } from '../common/validator';

@controller('/users')
export class UserController {
  constructor(@inject(MODULE_IDENTIFIERS.UserService) private userService: UserService) {}

  @httpPost('/register')
  async createUser(req: Request, res: Response): Promise<any> {
    try {
      const { error } = userSchema.validate(req.body, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          details: error.details.map((err) => err.message),
        });
      }
      
      const result = await this.userService.register(req.body);
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }

  @httpPost('/login')
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error,
      });
    }
  }
}
