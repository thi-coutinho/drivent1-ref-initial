import { TicketStatus } from '@prisma/client';
import { invalidBookingError, notFoundError, roomFullyBookedError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getByUserId(userId: number) {
  const booking = await bookingRepository.find(userId);
  if (!booking) throw notFoundError();
  const outputBooking = { id: booking.id, Room: booking.Room };
  return outputBooking;
}

async function create(userId: number, roomId: number) {
  await validateBooking(userId, roomId);
  const booking = await bookingRepository.create(userId, roomId);
  const idOutput = { bookingId: booking.id };
  return idOutput;
}

async function validateBooking(userId: number, roomId: number) {
  const room = await hotelRepository.findRoom(roomId);
  if (!room) throw notFoundError();
  if (room.capacity <= room.Booking.length) throw roomFullyBookedError();
  const ticket = await ticketRepository.findFirstTicketByUser(userId);
  if (
    !ticket ||
    ticket.status !== TicketStatus.PAID ||
    ticket.TicketType.isRemote ||
    !ticket.TicketType.includesHotel
  ) {
    throw invalidBookingError();
  }
}

const bookingService = {
  getByUserId,
  create,
};

export default bookingService;
