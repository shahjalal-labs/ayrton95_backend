import { Types } from "mongoose";

export type TParts = {
  _id?: string;
  partsName: string;
  brandName: string;
  modelNumber: number;
  price: number;
  description: string;
  partsImages: string[];
  user: string | Types.ObjectId;
};
