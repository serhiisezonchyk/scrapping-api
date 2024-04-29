import { Router } from 'express';
import ParseController from '../controllers/parse.controller';
import { logginAttemp } from '../middleware/logginAttemp';
import { verifyToken } from '../middleware/verifyToken';

class ParseRoutes {
  router = Router();
  controller = new ParseController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.get('/', verifyToken, logginAttemp, this.controller.parse);
    this.router.get('/my-parsed-requests', verifyToken, this.controller.getUserParsedReqs);
    this.router.get('/parsed-requests', verifyToken, this.controller.getParsedReqs);
  }
}

export default new ParseRoutes().router;
