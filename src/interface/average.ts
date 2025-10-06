import { IFile } from "../constants/database";

export interface IAverage {
  transaction_date?: number | null;
  vehicle_id: string;
  fuel_type: "Petrol" | "Diesel" | "CNG" | "Electric";
  amount_inr: number;
  driver_id: string;
  receipt?: IFile | null;
  driver_notes?: string | null;
  quantity_ltr?: number;
  quantity_kwh?: number;
  payment_mode: 'Cash' | 'Card' | 'Upi' | 'Net Banking' | 'other';
  is_approved?: boolean;
  id: string
  expand?: any
}