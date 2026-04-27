export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  size: string; // e.g. "50ML", "100ML"
  maxStock: number; // from Dev2's Product model
}

export interface CartState {
  items: CartItem[];
  promoCode?: string;
  promoDiscount: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethodType = "card" | "paypal" | "cod" | "wallet";

// NOTE: ShippingAddress is intentionally separate from Dev1's IAddress (User model).
// IAddress = saved profile address (street, city, state, country, zipCode)
// ShippingAddress = per-order delivery address (firstName, lastName, street, city, postalCode, country)
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  shipping: number;
  tax: number;
  promoDiscount: number;
  total: number;
  promoCode?: string;
  status: OrderStatus;
  trackingNumber?: string;
  stripePaymentIntentId?: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  guestEmail?: string;
  saveCard?: boolean;
}
