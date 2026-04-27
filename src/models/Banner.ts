import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  title: string;
  image: string;
  link?: string;
  isActive: boolean;
  position: "home_top" | "home_middle" | "home_bottom" | "sidebar";
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    isActive: { type: Boolean, default: true },
    position: {
      type: String,
      enum: ["home_top", "home_middle", "home_bottom", "sidebar"],
      required: true,
    },
  },
  { timestamps: true },
);

const Banner: Model<IBanner> =
  mongoose.models.Banner ?? mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
