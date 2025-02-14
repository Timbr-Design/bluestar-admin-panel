/* eslint-disable */
export const DATABASE_ITEMS = [
  {
    id: 1,
    name: "Duty types",
    type: "duty_types",
    text: "Create and manage your duty types here",
  },
  {
    id: 2,
    name: "Vehicle groups",
    type: "vehicle_groups",
    text: "Create and manage your vehicle groups here",
  },
  {
    id: 3,
    name: "Customers",
    type: "customers",
    text: "Create and manage your customers here",
  },
  {
    id: 4,
    name: "Drivers",
    type: "drivers",
    text: "Manage your drivers and their activity here.",
  },
  {
    id: 5,
    name: "Vehicles",
    type: "vehicles",
    text: "Create and manage your vehicle data here",
  },
  {
    id: 6,
    name: "Bank accounts",
    type: "bank_accounts",
    text: "Create and manage your bank accounts here",
  },
  {
    id: 7,
    name: "Taxes",
    type: "taxes",
    text: "Create and manage your tax data here",
  },
  {
    id: 8,
    name: "Allowances",
    type: "allowances",
    text: "Create and manage driver allowance here",
  },
  {
    id: 9,
    name: "FASTag",
    type: "fastag",
    text: "Repository of all your FASTag details",
  },
];

export const DUTY_TYPES = [
  {
    title: "Name",
    dataIndex: "name",
    className: "custom-header", // CSS class for header
  },
  {
    title: "Type",
    dataIndex: "type",
    className: "custom-column",
  },
  {
    title: "Max. Kilometers",
    dataIndex: "max_kilometers",
    className: "custom-column",
  },
  {
    title: "Max. Hours",
    dataIndex: "max_hours",
    className: "custom-column",
  },
];

export const VEHICLE_GROUPS = [
  {
    title: "Name",
    dataIndex: "name",
    className: "custom-header", // CSS class for header
  },
  {
    title: "Total vehicles",
    dataIndex: "vehicleCount",
    className: "custom-column",
  },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  // },
];

export const CUSTOMERS = [
  {
    title: "Name",
    dataIndex: "name",
    className: "custom-header", // CSS class for header
  },
  {
    title: "Phone",
    dataIndex: "phoneNumber",
    className: "custom-column",
  },
  {
    title: "GSTIN number",
    dataIndex: "gstNumber",
    className: "custom-column",
  },
  {
    title: "Status",
    dataIndex: "status",
    className: "custom-column",
  },
];

export const DRIVERS = [
  {
    title: "Name",
    dataIndex: "name",
    className: "custom-driver-header",
  },
  {
    title: "Driver ID",
    dataIndex: "driverId",
    className: "custom-column",
  },
  {
    title: "Phone",
    dataIndex: "phoneNumber",
    className: "custom-column",
  },
  {
    title: "Status",
    dataIndex: "status",
    className: "status-column",
  },
];

export const VEHICLES = [
  {
    title: "Model name",
    dataIndex: "modelName",
    className: "custom-header", // CSS class for header
  },
  {
    title: "Group",
    dataIndex: "group",
    className: "custom-column",
  },
  {
    title: "Assigned driver",
    dataIndex: "assigned_driver",
    className: "custom-column",
  },
  {
    title: "Vehicle number",
    dataIndex: "vehicleNumber",
    className: "custom-column",
  },
  {
    title: "Status",
    dataIndex: "status",
    className: "status-column",
  },
];

export const BANK_ACCOUNTS = [
  {
    title: "Name",
    dataIndex: "accountName",
    className: "custom-header", // CSS class for header
  },
  {
    title: "Account number",
    dataIndex: "accountNumber",
    className: "custom-column",
  },
  {
    title: "Bank name",
    dataIndex: "bankName",
    className: "custom-column",
  },
  {
    title: "Bank branch",
    dataIndex: "branchName",
    className: "custom-column",
  },
  {
    title: "IFSC code",
    dataIndex: "ifsc",
    className: "custom-column",
  },
];

export const DUTY_TYPES_TYPE = [
  {
    value: "Custom",
    label: "Custom",
  },
  {
    value: "Day - KM( Outstation)",
    label: "Day - KM( Outstation)",
  },
  {
    value: "HR - KM(Local)",
    label: "HR - KM(Local)",
  },
  {
    value: "Long Duration - Total KM Daily HR( Monthly Bookings)",
    label: "Long Duration - Total KM Daily HR( Monthly Bookings)",
  },
  { value: "Flat Rate", label: "Flat Rate" },
  {
    value: "Long Duration - Total KM & HR( Monthly Bookings)",
    label: "Long Duration - Total KM & HR( Monthly Bookings)",
  },
];

export const TAXES_TABLE = [
  { title: "Tax name", dataIndex: "name", className: "custom-header" },
  { title: "Percentage", dataIndex: "percentage" },
  { title: "Status", dataIndex: "status" },
];

export const ALLOWANCES_TABLE = [
  { title: "Name", dataIndex: "allowanceType", className: "custom-header" },
  { title: "Rate", dataIndex: "rate" },
  { title: "Status", dataIndex: "status", className: "status-column" },
];

export const FASTTAG_TABLE = [
  {
    title: "Tag Account",
    dataIndex: "tag_account",
    className: "custom-header",
  },
  {
    title: "License Plate No.",
    dataIndex: "license_plate",
    className: "custom-column",
  },
  {
    title: "Total Trips till month",
    dataIndex: "total_trips",
    className: "custom-column",
  },
  {
    title: "Total Cost incurred this month",
    dataIndex: "total_cost",
    className: "custom-column",
  },
];

export const STATES = [
  {
    value: "Andaman and Nicobar Islands",
    label: "Andaman and Nicobar Islands",
  },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
  { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
  { value: "Assam", label: "Assam" },
  { value: "Bihar", label: "Bihar" },
  { value: "Chandigarh", label: "Chandigarh" },
  { value: "Chhattisgarh", label: "Chhattisgarh" },
  { value: "Dadra and Nagar Haveli", label: "Dadra and Nagar Haveli" },
  { value: "Daman and Diu", label: "Daman and Diu" },
  { value: "Delhi", label: "Delhi" },
  { value: "Goa", label: "Goa" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Haryana", label: "Haryana" },
  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
  { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  { value: "Jharkhand", label: "Jharkhand" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Kerala", label: "Kerala" },
  { value: "Ladakh", label: "Ladakh" },
  { value: "Lakshadweep", label: "Lakshadweep" },
  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Manipur", label: "Manipur" },
  { value: "Meghalaya", label: "Meghalaya" },
  { value: "Mizoram", label: "Mizoram" },
  { value: "Nagaland", label: "Nagaland" },
  { value: "Odisha", label: "Odisha" },
  { value: "Puducherry", label: "Puducherry" },
  { value: "Punjab", label: "Punjab" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Sikkim", label: "Sikkim" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Telangana", label: "Telangana" },
  { value: "Tripura", label: "Tripura" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Uttarakhand", label: "Uttarakhand" },
  { value: "West Bengal", label: "West Bengal" },
];

export const ADDRESS_TYPE = [
  {
    value: "Permanent",
    label: "Permanent Address",
  },
  {
    value: "Temporary",
    label: "Temporary Address",
  },
];

export const CUSTOMER_TAX_TYPES = [
  {
    value: "Business",
    label: "Business",
  },
  {
    value: "Self Employed",
    label: "Self Employed",
  },
  { value: "Job", label: "Job" },
];

export const ALLOWANCES_TYPES = [
  {
    value: "dailyAllowance",
    label: "Daily Allowance",
  },
  {
    value: "overtimeAllowance",
    label: "Overtime Allowance",
  },
  {
    value: "outstationAllowance",
    label: "Outstation Allowance",
  },
  {
    value: "outstationOvernightAllowance",
    label: "Outstation Overnight Allowance",
  },
  {
    value: "offDayAllowance",
    label: "Off-Day Allowance",
  },
  {
    value: "earlyStartAllowance",
    label: "Early Start Allowance",
  },
  {
    value: "nightAllowance",
    label: "Night Allowance",
  },
  {
    value: "extraDutyAllowance",
    label: "Extra Duty Allowance",
  },
  {
    value: "airportAllowance",
    label: "Airport Allowance",
  },
];

export const Allowance = (value: string) => {
  switch (value) {
    case "dailyAllowance":
      return "Automatically included in the driver's salary for each day of duty, this allowance compensates for regular daily service provided.";
    case "overtimeAllowance":
      return "This allowance is provided on an hourly basis when a driver works beyond the standard number of designated hours, ensuring fair compensation for additional time spent on duty.";
    case "outstationAllowance":
      return "Automatically applied when a driver’s duty requires travel beyond the standard operating area, this allowance compensates for the additional responsibilities and time associated with outstation duties.";
    case "outstationOvernightAllowance":
      return "This allowance is automatically included if an outstation duty extends overnight, covering the driver's time and expenses for duties that require an overnight stay.";
    case "offDayAllowance":
      return "Awarded when a driver is required to work on their designated off day, this allowance ensures they are compensated for their additional commitment.";
    case "earlyStartAllowance":
      return "Provided on an hourly basis, this allowance compensates drivers who begin their duties earlier than their scheduled start time.";
    case "nightAllowance":
      return "Applied for duties that extend beyond a single day, this allowance compensates for the extended service hours and the overnight commitment required from the driver.";
    case "extraDutyAllowance":
      return "This allowance is awarded when a driver performs more than one duty within a single day. Each additional duty qualifies the driver for an additional allowance.";
    case "airportAllowance":
      return "Specifically added for duties that involve trips to the airport, this allowance compensates for the specific requirements and responsibilities associated with airport-related duties.";
    default:
      return null;
  }
};

export const FuelType = [
  { value: "Petrol", label: "Petrol" },
  { value: "Diesel", label: "Diesel" },
];

export interface IFile {
  fileSize: number;
  fileType: string;
  fileUrl: string;
}
