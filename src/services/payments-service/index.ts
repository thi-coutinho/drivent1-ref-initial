import { notFoundError, unauthorizedError } from '@/errors';
import { PaymentInput } from '@/protocols';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getPayment(ticketId: number, userId: number) {
  await validateTicket(ticketId, userId);
  const payment = await paymentRepository.getPayment(ticketId);

  if (!payment) throw notFoundError();

  return payment;
}

async function makePayment(paymentInput: PaymentInput, userId: number) {
  console.log('entrei no process');
  await validateTicket(paymentInput.ticketId, userId);

  const price = await ticketRepository.getTicketPrice(paymentInput.ticketId);
  const paymentOutput = await paymentRepository.makePayment(paymentInput, price);

  return paymentOutput;
}

async function validateTicket(ticketId: number, userId: number) {
  console.log('entrei no validate');
  const ticket = await ticketRepository.findFirstTicketById(ticketId);
  console.log('ticket achado foi: ', ticket);
  if (!ticket) throw notFoundError();
  else if (ticket.Enrollment.userId !== userId) throw unauthorizedError();
}

const paymentsService = {
  getPayment,
  makePayment,
};

export default paymentsService;
