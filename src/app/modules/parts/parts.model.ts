import { model, Schema } from "mongoose";
import { TParts } from "./parts.interface";

const partsSchema = new Schema<TParts>(
  {
    partsName: { type: String, required: [true, "Parts name is required"] },
    modelNumber: { type: Number, required: [true, "Model number is required"] },
    description: { type: String, required: [true, "Descriptin is required"] },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price minimum 1"],
    },
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
    },
    partsImages: {
      type: [String],
      required: false,
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

partsSchema.virtual("partsreviews", {
  ref: "PartsReview",
  localField: "_id",
  foreignField: "parts",
});

partsSchema.set("toObject", { virtuals: true });
partsSchema.set("toJSON", { virtuals: true });

export const Parts = model<TParts>("Parts", partsSchema);
