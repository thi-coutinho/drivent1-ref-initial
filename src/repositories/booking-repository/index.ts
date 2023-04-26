import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function find(userId: number): Promise<Booking> {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
  });
}

const bookingRepository = {
  find,
};

export default bookingRepository;
