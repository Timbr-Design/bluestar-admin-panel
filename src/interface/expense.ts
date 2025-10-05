import { File } from './file';

interface Reminder {
  reminderIntervalKm: string;
}

interface RepeatExpense {
  repeatInterval: string;
  endsAfter: number;
}

export interface IExpense {
  transaction_date: number;
  repeatExpense?: RepeatExpense | null;
  vehicleId: {
    modelName: string;
    vehicleNumber: string;
    _id: string
  };
  vehicle_id: string
  expenseTypes: string[];
  amount_inr: string;
  payment_mode: 'Cash' | 'Card' | 'Upi' | 'Net Banking' | 'other';
  reciept?: File | null;
  send_reminder?: Reminder | null;
  driver_notes?: string | null;
  is_approved?: boolean;
  id: string;
}

export const defaultExpenseValue = {
  repeatExpense: null,
  receipts: null,
  send_reminder: null,
  driver_notes: null,
  is_approved: true,
};