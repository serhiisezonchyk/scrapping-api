import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../db';
declare global {
  namespace Express {
    interface Request {
      attempId?: string;
    }
  }
}
export const logginAttemp = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    const data = await db.parseRequest.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    req.attempId = data.id;
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
  }
};
