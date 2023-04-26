import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function find(userId: number): Promise<
  Booking & {
    Room: Room;
  }
> {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

const bookingRepository = {
  find,
};

export default bookingRepository;
