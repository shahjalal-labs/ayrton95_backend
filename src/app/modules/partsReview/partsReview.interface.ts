import { Types } from "mongoose";

export type TPartsReview = {
  _id?: string;
  user: string | Types.ObjectId;
  bookingId: string;
  parts: string | Types.ObjectId;
  rating: number;
  comment: string;
};
