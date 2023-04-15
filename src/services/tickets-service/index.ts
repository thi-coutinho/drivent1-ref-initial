import { notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes() {
  const ticketsTypes = await ticketRepository.findManyTicketTypes();
  if (!ticketsTypes) throw notFoundError();
  return ticketsTypes;
}

async function createNewTicket(ticketTypeId: number, userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const newTicket = await ticketRepository.createNewTicket(ticketTypeId, enrollment.id);
  return newTicket;
}

async function getTicket(userId: number) {
  const tickets = await ticketRepository.findFirstTicketByUser(userId);
  if (!tickets) throw notFoundError();
  return tickets;
}

const ticketsService = {
  getTicketTypes,
  createNewTicket,
  getTicket,
};

export default ticketsService;
