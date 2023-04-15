import { notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

export async function getPayment(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findFirstTicketById(ticketId);

  if (!ticket) throw notFoundError();
  else if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.getPayment(ticketId);

  if (!payment) throw notFoundError();

  return payment;
}

const paymentsService = {
  getPayment,
};

export default paymentsService;
