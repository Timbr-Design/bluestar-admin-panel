import { File } from "./file";

export interface IFuel {
  date?: number | null;
  vehicleId: number;
  fuelType: "Petrol" | "Diesel" | "CNG" | "Electric";
  quantity: number;
  amount: number;
  driverId: number;
  receipts?: File[] | null;
  notes?: string | null;
}