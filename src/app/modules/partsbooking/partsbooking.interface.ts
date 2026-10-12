import { Types } from "mongoose";

export type TPartsBooking = {
  _id?: string;
  parts: string | Types.ObjectId;
  user: string | Types.ObjectId;
  paymentStatus: boolean;
  paymentMethodId: string;
  bookingStatus: string;
  quantity: number;
};
