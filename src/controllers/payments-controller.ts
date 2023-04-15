import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { ticketId } = req.query;

  try {
    const payment = await paymentsService.getPayment(Number(ticketId), userId);
    res.send(payment);
  } catch (error) {
    next(error);
  }
}
