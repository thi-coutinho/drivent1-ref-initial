import { NextFunction, Response } from 'express';
import { Room } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getByUserId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const booking: { id: number; Room: Room } = await bookingService.getByUserId(userId);
    res.send(booking);
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: AuthenticatedRequest & { params: { roomId: number } },
  res: Response,
  next: NextFunction,
) {
  const {
    userId,
    params: { roomId },
  } = req;
  try {
    const booking: { bookingId: number } = await bookingService.create(userId, roomId);
    res.send(booking);
  } catch (error) {
    next(error);
  }
}
