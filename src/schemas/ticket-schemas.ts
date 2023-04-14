import Joi from 'joi';
import { TicketEntry } from '@/services';

export const createTicketSchema = Joi.object<TicketEntry>({
  ticketTypeId: Joi.number().required(),
});
