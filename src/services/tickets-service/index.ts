import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes() {
  const ticketsTypes = await ticketRepository.findManyTicketTypes();
  if (!ticketsTypes) throw notFoundError();
  return ticketsTypes;
}

async function createNewTicket(ticketTypeId: number, userId: number) {
  const newTicket = await ticketRepository.createNewTicket(ticketTypeId, userId);
  return newTicket;
}
export type TicketEntry = { ticketTypeId: number };
const ticketsService = {
  getTicketTypes,
  createNewTicket,
};

export default ticketsService;
