import { Router } from 'express';
import { getTicketTypes, createNewTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', createNewTicket)
  .get('/types', validateBody(createTicketSchema), getTicketTypes);

export { ticketsRouter };
