import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../../models/users.model';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      token?: string | null;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Access denied' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Access denied' });
  }
};

export default authMiddleware;
