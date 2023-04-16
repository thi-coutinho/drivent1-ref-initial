import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { getPayment, makePayment } from '@/controllers/payments-controller';
import { TicketIdSchema, paymentInputSchema } from '@/schemas';

const paymentsRouter = Router();
paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(TicketIdSchema), getPayment)
  .post('/process', validateBody(paymentInputSchema), makePayment);

export { paymentsRouter };
