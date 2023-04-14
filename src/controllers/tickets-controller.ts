import httpStatus from 'http-status';
import { Ticket, TicketType } from '@prisma/client';
import { NextFunction, Response } from 'express';
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

export async function createNewTicket(
  req: AuthenticatedRequest & { ticketTypeId: number },
  res: Response,
  next: NextFunction,
) {
  const {
    body: { ticketTypeId },
    userId,
  } = req;
  try {
    const ticket: Ticket & { TicketType: TicketType } = await ticketsService.createNewTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    else next(error);
  }
}
