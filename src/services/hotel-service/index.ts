import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function validadeHotelRequest(userId: number): Promise<void> {
  // Não existe (inscrição, ticket): 404 (not found)
  const hasEnrollment = await enrollmentRepository.findByUserId(userId);
  if (!hasEnrollment) throw notFoundError();
  const hasTicket = await ticketRepository.findFirstTicketByUser(userId);
  if (!hasTicket) throw notFoundError();
  // Ticket não foi pago, é remoto ou não inclui hotel: 402 (payment required)
  if (hasTicket.TicketType.isRemote || !hasTicket.TicketType.includesHotel || hasTicket.status !== 'PAID') {
    throw paymentRequiredError();
  }
}

async function getHotels(userId: number) {
  validadeHotelRequest(userId);
  return await hotelRepository.findMany();
}

async function getHotelbyId(userId: number, hotelId: number) {
  validadeHotelRequest(userId);
  return await hotelRepository.findById(hotelId);
}

const hotelsService = {
  getHotels,
  getHotelbyId,
};

export default hotelsService;
