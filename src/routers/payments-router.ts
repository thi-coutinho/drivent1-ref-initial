import { Router } from 'express';
import { authenticateToken, validateQuery } from '@/middlewares';
import { getPayment } from '@/controllers/payments-controller';
import { TicketIdSchema } from '@/schemas';

const paymentsRouter = Router();
paymentsRouter.all('/*', authenticateToken).get('/', validateQuery(TicketIdSchema), getPayment);
// .post('/', validateBody(createTicketSchema), createNewTicket);

export { paymentsRouter };
