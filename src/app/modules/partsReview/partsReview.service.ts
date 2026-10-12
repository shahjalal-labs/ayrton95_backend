import AppError from "../../utils/AppError";
import { PartsBooking } from "../partsbooking/partsbooking.model";
import { TPartsReview } from "./partsReview.interface";
import { PartsReview } from "./partsReview.model";

const createReview = async (
  data: TPartsReview,
  userId: string,
  bookingId: string
) => {
  const reviewExist = await PartsReview.findOne({
    bookingId,
  });
  if (reviewExist) {
    throw new AppError(400, "Review already exist");
  }

  const bookingExist = await PartsBooking.findOne({
    _id: bookingId,
  });
  if (!bookingExist) {
    throw new AppError(400, "Booking not found");
  }

  await PartsReview.create({
    ...data,
    parts: bookingExist.parts,
    bookingId,
    user: userId,
  });

  return;
};

const getAllReviews = async () => {
  const results = await PartsReview.find();
  return results;
};

const getReviewById = async (id: string) => {
  const result = await PartsReview.findOne({ _id: id });
  return result;
};

const updateReview = async (id: string, data: Partial<TPartsReview>) => {
  await PartsReview.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteReview = async (id: string) => {
  await PartsReview.findOneAndDelete({ _id: id });
  return;
};

export const partsReviewServices = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
