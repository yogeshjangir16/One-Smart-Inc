export interface Product {
  id: string;
  name: string;
  specifics: string;
  purchase_date: string;
  quantity: number;
  purchase_price: number;
  discount: number;
  mrp: number;
  expiry_date: string;
  created_at?: string;
}

export interface ReturnProduct extends Product {
  returnDate: string;
  actualMoneyReceived: number;
  returnReason: string;
}

export interface BillItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'upi';
  paymentReceived: number;
  change: number;
  profit: number;
}