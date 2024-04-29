import { Router } from 'express';
import ParseController from '../controllers/parse.controller';

class ParseRoutes {
  router = Router();
  controller = new ParseController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/parse', this.controller.parse);
    this.router.get('/parse-requests', this.controller.getParsedReqs);
  }
}

export default new ParseRoutes().router;
