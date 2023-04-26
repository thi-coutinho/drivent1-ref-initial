import { NextFunction, Response } from 'express';
import { Booking, Room } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking: Booking & {
      Room: Room;
    } = await bookingService.getByUserId(userId);
    res.send(booking);
  } catch (error) {
    next(error);
  }
}
