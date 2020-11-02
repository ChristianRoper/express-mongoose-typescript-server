import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export interface UserAuthInfo extends Request {
  user: {
    id: string
  }
}

export default function (req: UserAuthInfo, res: Response, next: NextFunction) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = (decoded as any).user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
