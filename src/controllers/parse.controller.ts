import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../db';

export default class ParseController {
  async parse(req: Request, res: Response) {}
  async getParsedReqs(req: Request, res: Response) {
    const user = req.user;
    try {
      const data = await db.parseRequest.findMany({
        where: {
          userId: user?.id,
        },
      });
      res.status(StatusCodes.OK).json({ data: data });
    } catch (error) {}
  }
}
