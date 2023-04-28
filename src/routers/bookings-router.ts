import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getByUserId, create } from '@/controllers/booking-controller';
import { bookingInputSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getByUserId).post('/', validateBody(bookingInputSchema), create);

export { bookingsRouter };
