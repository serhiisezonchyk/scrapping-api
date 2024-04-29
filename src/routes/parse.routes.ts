import { Router } from 'express';
import ParseController from '../controllers/parse.controller';
import { validateData } from '../middleware/validateData';
import { verifyToken } from '../middleware/verifyToken';
import { parseSchema } from '../schemas/parseSchema';

class ParseRoutes {
  router = Router();
  controller = new ParseController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/parse', verifyToken, validateData(parseSchema), this.controller.parse);
    this.router.get('/parse-requests', verifyToken, this.controller.getParsedReqs);
  }
}

export default new ParseRoutes().router;
