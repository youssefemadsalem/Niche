import mongoose, { Schema, Document, Model } from "mongoose";
import { OrderStatus, PaymentMethodType } from "@/types";

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: PaymentMethodType;
  stripePaymentIntentId?: string;
  subtotal: number;
  shipping: number;
  tax: number;
  promoDiscount: number;
  total: number;
  promoCode?: string;
  status: OrderStatus;
  trackingNumber?: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: Date;
    note?: string;
  }>;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () =>
        `NICHE-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    },
    userId: { type: String, index: true }, // Dev1 User._id as string
    guestEmail: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, default: "" },
        size: { type: String, default: "" },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "cod", "wallet"],
      required: true,
    },
    stripePaymentIntentId: { type: String },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    promoDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    trackingNumber: { type: String },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
