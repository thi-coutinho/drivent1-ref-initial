import { TicketType } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '@/config';

async function findManyTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function createNewTicket(ticketTypeId: number, userId: number) {
  const { id: enrollmentId } = await prisma.enrollment.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
  return await prisma.ticket.create({
    data: {
      status: 'RESERVED',
      ticketTypeId,
      enrollmentId,
      updatedAt: dayjs().date().toString(),
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
