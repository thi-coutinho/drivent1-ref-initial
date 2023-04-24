import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotel-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  try {
    const hotels = await hotelsService.getHotels(userId);
    res.send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelbyId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId, params: hotelId } = req;

  try {
    const hotel = await hotelsService.getHotelbyId(userId, Number(hotelId));
    res.send(hotel);
  } catch (error) {
    next(error);
  }
}
