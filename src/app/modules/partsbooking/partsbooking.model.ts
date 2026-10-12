import { model, Schema } from "mongoose";
import { TPartsBooking } from "./partsbooking.interface";

const bookingStatus = ["Pending", "Delivered", "CancelByAdmin"];

const bookingSchema = new Schema<TPartsBooking>(
  {
    parts: {
      type: Schema.Types.ObjectId,
      required: [true, "Parts is required"],
      ref: "Parts",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
    },
    paymentStatus: {
      type: Boolean,
      required: false,
      default: false,
    },
    paymentMethodId: {
      type: String,
      required: [true, "Payment Method ID is required"],
    },
    bookingStatus: {
      type: String,
      enum: bookingStatus,
      required: true,
      default: "Pending",
    },
    quantity: {
      type: Number,
      required: false,
      default: 1,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const PartsBooking = model<TPartsBooking>("PartsBooking", bookingSchema);
