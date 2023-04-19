import { TicketType } from '@prisma/client';
import { prisma } from '@/config';
import { TicketCreate } from '@/protocols';

async function findManyTicketTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function createNewTicket(ticket: TicketCreate) {
  return await prisma.ticket.create({
    data: {
      ...ticket,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findFirstTicketByUser(userId: number) {
  return prisma.ticket.findFirst({
    where: { Enrollment: { userId } },
    include: { TicketType: true },
  });
}

async function findFirstTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
    include: { Enrollment: true },
  });
}

async function getTicketPrice(ticketId: number) {
  const {
    TicketType: { price },
  } = await prisma.ticket.findFirst({
    where: { id: ticketId },
    select: { TicketType: { select: { price: true } } },
  });
  return price;
}

const ticketRepository = {
  findManyTicketTypes,
  createNewTicket,
  findFirstTicketByUser,
  findFirstTicketById,
  getTicketPrice,
};

export default ticketRepository;
