export interface IBookingRequest {
    bookingId: string;
    customerId: string;
    bookedBy?: {
      name: string;
      phoneNo: string;
      email: string;
    };
    passenger?: Array<{
      name: string;
      phoneNo: string;
      email: string;
    }>;
    dutyTypeId: string;
    vehicleGroupId: string[];
    from?: string;
    to?: string;
    reportingAddress: string;
    dropAddress: string;
    localBooking?: boolean;
    outstationBooking?: boolean;
    airportBooking?: boolean;
    durationDetails: {
      startDate: number;
      endDate: number;
      reportingTime: number;
      dropTime: number;
      garageStartTime: number;
    };
    pricingDetails: {
      baseRate: number;
      perExtraKm: number;
      perExtraHour: number;
      billTo: string;
    };
    operator_notes?: string;
    notes?: string;
    status?: string;
  }

interface ITaxDetails {
  type: string;
  gstNumber: string;
}

interface IFileData {
  file: string;
  fileType: string;
  fileSize: number;
}

interface IFile {
  data: IFileData;
  _id: string;
}

interface ICustomer {
  _id: string;
  customerCode: string;
  name: string;
  phoneNumber: string;
  address: string;
  pinCode: string;
  state: string;
  taxDetails: ITaxDetails;
  defaultDiscount: number;
  files: IFile[];
  notes: string;
  isActive: boolean;
  autoCreateInvoice: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IVehicleGroup {
  _id: string;
  name: string;
  seatingCapacity: number;
  description: string;
  luggageCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IPerson {
  name: string;
  phoneNo: number;
  email: string;
  _id: string;
}

interface IDurationDetails {
  startDate: number;
  endDate: number;
  reportingTime: number;
  dropTime: number;
  garageStartTime: number;
  _id: string;
}

interface IPricingDetails {
  baseRate: number;
  perExtraKm: number;
  perExtraHour: number;
  billTo: string;
  _id: string;
}

export interface IBookingResponse {
  _id: string;
  bookingId: string;
  bookedBy: IPerson;
  passenger: IPerson[];
  from: string;
  to: string;
  reportingAddress: string;
  dropAddress: string;
  localBooking: boolean;
  outstationBooking: boolean;
  airportBooking: boolean;
  durationDetails: IDurationDetails;
  pricingDetails: IPricingDetails;
  operator_notes: string;
  notes: string;
  isActive: boolean;
  status: string;
  customer: ICustomer;
  vehicleGroup: IVehicleGroup[];
}