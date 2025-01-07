export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
}

export interface TicketCategory {
  id: string;
  name: string;
  price: number;
  ageRestriction?: {
    min?: number;
    max?: number;
  };
  requiresStudentCard: boolean;
}

export interface Ticket {
  id: string;
  categoryId: string;
  customerId: string;
  qrCode: string;
  eventName: string;
  organizerName: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  customerId: string;
  totalAmount: number;
  pdfPath: string;
  createdAt: Date;
  tickets: Ticket[];
}

export interface CartItem {
  categoryId: string;
  quantity: number;
}