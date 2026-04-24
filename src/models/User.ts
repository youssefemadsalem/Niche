import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IPaymentDetails {
  cardholderName: string;
  lastFourDigits: string;
  expiryDate: string;
  paymentType: "credit" | "debit";
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string; // optional because Google login users won't have one
  image?: string;
  role: "customer" | "seller" | "admin";
  isVerified: boolean;
  isApproved: boolean; // admin approves sellers
  isDeleted: boolean; // soft delete
  address?: IAddress;
  paymentDetails?: IPaymentDetails[];
  wishlist: mongoose.Types.ObjectId[];
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
});

const PaymentDetailsSchema = new Schema<IPaymentDetails>({
  cardholderName: { type: String },
  lastFourDigits: { type: String },
  expiryDate: { type: String },
  paymentType: { type: String, enum: ["credit", "debit"] },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String },
    password: { type: String }, // hashed
    image: { type: String },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true }, // false for sellers until admin approves
    isDeleted: { type: Boolean, default: false }, // soft delete
    address: { type: AddressSchema },
    paymentDetails: { type: [PaymentDetailsSchema], default: [] },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  },
);

// Prevent returning soft-deleted users by default
UserSchema.pre(["find", "findOne", "findOneAndUpdate"], function () {
  this.setQuery({ ...this.getQuery(), isDeleted: false });
});

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
