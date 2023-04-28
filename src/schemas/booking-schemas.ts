import Joi from 'joi';

export const bookingInputSchema = Joi.object({
  roomId: Joi.number().integer().positive().required(),
});
