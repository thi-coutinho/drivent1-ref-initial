import { TicketStatus, User } from '@prisma/client';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createTicket, createTicketType } from './tickets-factory';
import { createValidRoom } from './hotels-factory';
import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: { roomId, userId },
    include: { Room: true },
  });
}

export async function createValidBooking(user: User) {
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketType(false, true);
  await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  const room = await createValidRoom();
  return await createBooking(user.id, room.id);
}

export async function getBooking(user: User) {
  return await prisma.booking.findFirst({ where: { userId: user.id } });
}
