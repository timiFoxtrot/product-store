import { injectable } from "inversify";
import User, { IUser } from "../models/users.model";


@injectable()
export class UserRepository {
  async create(user: IUser): Promise<IUser> {
    const newUser = new User(user);
    return await newUser.save();
  }
}
