import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JwtType } from '../controllers/auth.controller';
import { StatusCodes } from 'http-status-codes';
declare global {
  namespace Express {
    interface Request {
      user?: JwtType;
    }
  }
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated', details: '' });
  jwt.verify(token, process.env.SECRET_KEY as string, async (error: VerifyErrors | any, decoded: JwtType | any) => {
    if (error) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated', details: error });
    const decodedValue: JwtType = decoded;
    req.user = decodedValue;
    next();
  });
};
