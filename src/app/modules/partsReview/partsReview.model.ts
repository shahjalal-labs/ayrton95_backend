import { model, Schema } from "mongoose";
import { TPartsReview } from "./partsReview.interface";

const reviewSchema = new Schema<TPartsReview>(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: { type: String, required: false },
    bookingId: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    parts: {
      type: Schema.Types.ObjectId,
      required: [true, "Parts id is required"],
      ref: "Parts",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PartsReview = model<TPartsReview>("PartsReview", reviewSchema);
