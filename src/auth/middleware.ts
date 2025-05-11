import { Request, Response, NextFunction } from 'express';
import { decodeAuthToken, tryGetUserIdFromAuthToken } from '../helpers/token';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authorization header missing or malformed" });
    return
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = decodeAuthToken(token);
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};