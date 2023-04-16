import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { PaymentInput } from '@/protocols';

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

export async function makePayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const paymentInput = req.body as PaymentInput;
  const { userId } = req;
  try {
    const paymentOutput = await paymentsService.makePayment(paymentInput, userId);
    res.send(paymentOutput);
  } catch (error) {
    next(error);
  }
}
