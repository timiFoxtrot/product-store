import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/users.model';

@injectable()
export class UserRepository {
  async create(user: IUser): Promise<IUser> {
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) throw new Error('Email already taken');
    const newUser = new User(user);
    return await newUser.save();
  }

  async login(data: { email: string; password: string }) {
    const user = await User.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });
    return token;
  }
}
