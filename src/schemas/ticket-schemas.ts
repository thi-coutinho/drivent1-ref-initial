import Joi from 'joi';
import { Ticket } from '@prisma/client';
import { TicketEntry } from '@/services';

export const createTicketSchema = Joi.object<TicketEntry>({
  ticketTypeId: Joi.number().required(),
});

export const ticketSchema = Joi.object<Ticket>({
  status: Joi.string().allow('PAID', 'RESERVED').required(),
  id: Joi.number().positive(),
  createdAt: Joi.date(),
  enrollmentId: Joi.number(),
  ticketTypeId: Joi.number(),
  updatedAt: Joi.date(),
});
