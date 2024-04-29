import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JwtType } from '../controllers/auth.controller';
declare global {
  namespace Express {
    interface Request {
      user?: JwtType;
    }
  }
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.token) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated', details: '' });
  jwt.verify(
    cookies.token,
    process.env.SECRET_KEY as string,
    async (error: VerifyErrors | any, decoded: JwtType | any) => {
      if (error) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Not authenticated', details: error });
      const decodedValue: JwtType = decoded;
      req.user = decodedValue;
      next();
    },
  );
};
