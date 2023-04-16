import dayjs from 'dayjs';
import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { PaymentInput } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function makePayment(paymentInput: PaymentInput, price: number): Promise<Payment> {
  await prisma.ticket.update({
    where: { id: paymentInput.ticketId },
    data: { status: 'PAID', updatedAt: dayjs().toDate() },
  });
  const cardLastDigits = paymentInput.cardData.number.toString().slice(-4);
  return prisma.payment.create({
    data: {
      ticketId: paymentInput.ticketId,
      cardIssuer: paymentInput.cardData.issuer,
      cardLastDigits,
      value: price,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
    },
  });
}

const paymentRepository = {
  getPayment,
  makePayment,
};

export default paymentRepository;
