import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getByUserId(userId: number) {
  const booking = await bookingRepository.find(userId);
  if (!booking) throw notFoundError();
  const outputBooking = { id: booking.id, Room: booking.Room };
  return outputBooking;
}

const bookingService = {
  getByUserId,
};

export default bookingService;
