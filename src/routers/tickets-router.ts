import { Router } from 'express';
import { getTicketTypes, createNewTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(createTicketSchema), createNewTicket)
  .get('/types', getTicketTypes);

export { ticketsRouter };
