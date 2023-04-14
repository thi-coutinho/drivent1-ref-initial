import httpStatus from 'http-status';
import { Ticket, TicketType } from '@prisma/client';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.send(ticketTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function createNewTicket(req: AuthenticatedRequest & { ticketTypeId: number }, res: Response) {
  console.log('entrei no controller');
  const { ticketTypeId, userId } = req.body;
  try {
    const ticket: Ticket & { TicketType: TicketType } = await ticketsService.createNewTicket(ticketTypeId, userId);
    return res.send(ticket);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
