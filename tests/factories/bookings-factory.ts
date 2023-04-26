import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: { roomId, userId },
    include: { Room: true },
  });
}
