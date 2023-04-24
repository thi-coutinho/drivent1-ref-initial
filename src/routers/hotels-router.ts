import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelbyId } from '@/controllers';

const hotelsRouter = Router();
hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelbyId);

export { hotelsRouter };
