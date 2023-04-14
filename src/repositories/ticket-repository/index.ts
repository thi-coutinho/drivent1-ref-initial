import { TicketType } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '@/config';

async function findManyTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function createNewTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
      updatedAt: dayjs().toDate(),
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findManyTicketTypes,
  createNewTicket,
};

export default ticketRepository;
