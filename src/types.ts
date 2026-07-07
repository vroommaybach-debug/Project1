export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock_count: number;
  images: string[];
  category: string;
  ingredients: string[];
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  payment_method: 'card_quickseller' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed';
  fulfillment_status: 'pending' | 'processing' | 'shipped';
  shipping_address: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
