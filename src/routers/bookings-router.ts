import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getByUserId, create, update } from '@/controllers/booking-controller';
import { bookingInputSchema, bookingParamsSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getByUserId)
  .post('/', validateBody(bookingInputSchema), create)
  .put('/:bookingId', validateBody(bookingInputSchema), validateParams(bookingParamsSchema), update);

export { bookingsRouter };
