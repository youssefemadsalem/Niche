import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, default: "NICHE" },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stock: { type: Number, default: 0 },
    notes: [{ type: String }],
    size: { type: String, default: "50ML" },
    isFeatured: { type: Boolean, default: false },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default models.Product || model("Product", ProductSchema);
