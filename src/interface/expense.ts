import { File } from './file';

interface Reminder {
  reminderIntervalKm: string;
}

interface RepeatExpense {
  repeatInterval: string;
  endsAfter: number;
}

export interface IExpense {
  date: number;
  repeatExpense?: RepeatExpense | null;
  vehicleId: {
    modelName: string;
    vehicleNumber: string;
    _id: string
  };
  expenseType: string[];
  amount: string;
  paymentMode: 'cash' | 'card' | 'upi' | 'netbanking' | 'other';
  receipts?: File | null;
  reminder?: Reminder | null;
  notes?: string | null;
  isActive?: boolean;
  _id: string;
}

export const defaultExpenseValue = {
  repeatExpense: null,
  receipts: null,
  reminder: null,
  notes: null,
  isActive: true,
};