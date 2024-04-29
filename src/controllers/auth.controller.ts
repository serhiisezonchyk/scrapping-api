import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
export interface JwtType {
  id: string;
  email: string;
}
const generateJwt = (credentials: JwtType, age: number): string | null => {
  return jwt.sign(credentials, process.env.SECRET_KEY as string, { expiresIn: age });
};
export default class AuthController {
  async signUp(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const isExist = await db.user.findUnique({
        where: email,
      });
      if (!isExist) return res.status(401).json({ error: 'Invalid data', details: 'Invalid data. Try later.' });
      const hashedPass = await bcrypt.hash(password, 10);
      await db.user.create({
        data: {
          email: email,
          password: hashedPass,
        },
      });
      res.status(201).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ error: 'SignUp was failed', details: error });
    }
  }
  async signIn(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await db.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) return res.status(401).json({ error: 'Invalid credential', details: '' });
      const isValidPass = await bcrypt.compare(password, user.password);
      if (!isValidPass) return res.status(401).json({ error: 'Invalid credential', details: '' });

      const exp = 1000 * 60 * 60 * 24;
      const token = generateJwt({ id: user.id, email: user.email }, exp);
      const { password: userPass, ...userInfo } = user;
      res
        .cookie('token', token, {
          httpOnly: true,
          maxAge: exp,
        })
        .status(200)
        .json({ message: 'Success', data: userInfo });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong while login.' });
    }
  }
  async logout(req: Request, res: Response) {
    res.clearCookie('token').status(200).json({ message: 'Success.' });
  }
}
