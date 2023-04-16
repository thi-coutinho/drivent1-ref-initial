import Joi from 'joi';
import { PaymentInput } from '@/protocols';

export const paymentInputSchema = Joi.object<PaymentInput>({
  ticketId: Joi.number().required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().required(),
  }),
});
