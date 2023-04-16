import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { TicketIdSchema, paymentInputSchema } from '@/schemas';
import { getPayment, makePayment } from '@/controllers';

const paymentsRouter = Router();
paymentsRouter
  .all('/*', authenticateToken)
  .get('/', validateQuery(TicketIdSchema), getPayment)
  .post('/process', validateBody(paymentInputSchema), makePayment);

export { paymentsRouter };
