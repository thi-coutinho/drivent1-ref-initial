import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getByUserId, create } from '@/controllers/booking-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getByUserId).post('/', create);

export { bookingsRouter };
