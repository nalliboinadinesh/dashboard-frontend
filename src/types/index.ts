export type RoomType = 'AC' | 'Non AC' | 'NON AC' | string;

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Pending' | 'Overdue';

export type TicketCategory = 'Electrical' | 'Water' | 'Cleaning' | 'Internet' | 'Furniture' | 'Food' | 'Bathroom' | 'Other';

export type TicketStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNo: string;
  roomType: RoomType;
  hostelName: string;
  monthlyFee: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  joinDate: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  date: string;
  imageUrl?: string;
}

export interface HostelInfo {
  id: string;
  hostelName: string;
  hostelType: string;
  ownerName: string;
  email: string;
  ownerNumber: string;
}

export interface RoomInfo {
  id: string;
  roomNumber: string;
  roomType: string;
  totalBeds: number;
}

export interface PaymentCycle {
  _id: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  isPaid: boolean;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export interface PaymentsInfo {
  monthlyRent: number;
  deposit: number;
  totalDues: number;
  paidCycles: number;
  unpaidCycles: number;
  lastPaidDate: string | null;
  cycles: PaymentCycle[];
}

export interface DashboardData {
  tenant: Tenant;
  facilities: string[];
  recentTickets: Ticket[];
  hostel?: HostelInfo;
  room?: RoomInfo;
  payments?: PaymentsInfo;
}

export interface UserSession {
  token: string;
  tenant: Tenant;
}

