export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
};

export type AddressEnrollment = {
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  error?: string;
};

export type RequestError = {
  status: number;
  data: object | null;
  statusText: string;
  name: string;
  message: string;
};

export type TicketEntry = { ticketTypeId: number };

export type TicketId = { ticketId: number };

export type PaymentInput = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

export type PaymentOutput = {
  id: number;
  ticketId: number;
  value: number;
  cardIssuer: 'VISA' | 'MASTERCARD';
  cardLastDigits: string;
  createdAt: Date;
  updatedAt: Date;
};
