import { File } from './file';

export interface InvoiceBooking {
  bookingId: string;
  description: string;
}

export interface InvoiceTax {
  type: string;
  amount: string;
}

export interface InvoiceDiscount {
  type: string;
  amount: string;
}

export interface Invoice extends Document {
  billingCompanyId: string;
  customerId: string;
  gstNumber?: string;
  billingName: string;
  billingAddress: string;
  taxId?: string;
  invoiceDate: number;
  invoiceNumber: string;
  dueDate: number;
  invoicePeriodStart: number;
  invoicePeriodEnd: number;
  bookings: InvoiceBooking[];
  tax?: InvoiceTax[];
  discount?: InvoiceDiscount[];
  salesTaxable?: string;
  documents?: File[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}