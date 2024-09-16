import { inject, injectable } from 'inversify';
import { IUser } from '../models/users.model';
import { UserRepository } from '../repositories/users.repository';
import MODULE_IDENTIFIERS from '../common/config/identifiers';

@injectable()
export class UserService {
  constructor(@inject(MODULE_IDENTIFIERS.UserRepository) private userRepository: UserRepository) {}

  async register(user: IUser): Promise<IUser> {
    return this.userRepository.create(user);
  }

  async login(email: string, password: string) {
    return this.userRepository.login({email, password})
  }
}
