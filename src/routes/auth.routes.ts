import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

class AuthRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/sign-up', this.controller.signUp);
    this.router.post('/login', this.controller.signIn);
    this.router.get('/logout', this.controller.logout);
  }
}

export default new AuthRoutes().router;
