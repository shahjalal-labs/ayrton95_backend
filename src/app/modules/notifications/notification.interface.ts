import { Types } from "mongoose";

export type TNotification = {
  _id?: string;
  title: string;
  body: string;
  user: string | Types.ObjectId;
};
