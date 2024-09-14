import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { UserService } from '../services/users.service';
import MODULE_IDENTIFIERS from '../common/config/identifiers';

@controller('/users')
export class UserController {
  constructor(
    @inject(MODULE_IDENTIFIERS.UserService) private userService: UserService
  ) {}

  @httpPost('/')
  public async getUsers(req: any, res: any): Promise<any> {
    const users = await this.userService.register(req.body);
    return res.json(users);
  }
}
