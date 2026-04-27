import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // e.g., "smart-watches"
    image: { type: String }, // For category thumbnails
  },
  { timestamps: true },
);

export default models.Category || model("Category", CategorySchema);
