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

async function create(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: { userId, roomId },
    select: { id: true },
  });
}

const bookingRepository = {
  find,
  create,
};

export default bookingRepository;
