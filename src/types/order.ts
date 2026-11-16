import { MenuItem } from '../data/menuData';

export type PaymentMethod = 'vodafone_cash' | 'salary_deduction';

export interface CartEntry {
  item: MenuItem;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  deliverySlot: string;
  notes: string;
  paymentMethod: PaymentMethod;
  vodafoneRef?: string;
  items: {
    code: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'recorded' | 'paid';
}
