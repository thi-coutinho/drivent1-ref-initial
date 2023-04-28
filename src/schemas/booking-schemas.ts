import Joi from 'joi';

export const bookingInputSchema = Joi.object({
  roomId: Joi.number().integer().positive().required(),
});

export const bookingParamsSchema = Joi.object({
  bookingId: Joi.string().regex(/^[0-9]+$/),
});
