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
  return await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { Rooms: true },
  });
}

async function findRoom(roomId: number) {
  return await prisma.room.findFirst({
    where: { id: roomId },
    include: { Booking: true },
  });
}

const hotelRepository = {
  findMany,
  findById,
  findRoom,
};

export default hotelRepository;
