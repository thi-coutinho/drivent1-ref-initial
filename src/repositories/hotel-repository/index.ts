import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findMany(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

async function findById(hotelId: number): Promise<
  Hotel & {
    Rooms: Room[];
  }
> {
  return await prisma.hotel.findFirst({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

const hotelRepository = {
  findMany,
  findById,
};

export default hotelRepository;
