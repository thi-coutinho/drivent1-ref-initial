import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getByUserId } from '@/controllers/booking-controller';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getByUserId);

export { bookingsRouter };
