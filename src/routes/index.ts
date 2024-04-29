import { Router } from 'express';
import authRoutes from './auth.routes';
import parseRoutes from './parse.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/post', parseRoutes);

export default router;
