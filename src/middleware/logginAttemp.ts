import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../db';

export const logginAttemp = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  try {
    await db.parseRequest.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });
  }
};
