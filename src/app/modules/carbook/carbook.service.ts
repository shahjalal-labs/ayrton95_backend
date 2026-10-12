import { notifyQueue } from "../../../queues/notification";
import AppError from "../../utils/AppError";
import { paginationHelper } from "../../utils/pagination";
import { User } from "../user/user.model";
import { TCarbook } from "./carbook.interface";
import { Carbook } from "./carbook.model";

const createCarbook = async (data: TCarbook, userId: string, carId: string) => {
  const bookingTime = new Date(data.dateTime).getTime();
  const now = Date.now();

  const userInfo = await User.findById({
    _id: userId,
  });
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  const isExist = await Carbook.findOne({
    car: carId,
    user: userId,
  });

  if (isExist) {
    throw new AppError(409, "This car already booked");
  }

  await Carbook.create({
    ...data,
    user: userId,
    car: carId,
  });

  await notifyQueue.add("carBook", {
    userId,
    title: "Car Booking Successful",
    body: "Your car has been successfully booked.",
  });

  // send 10 hours before
  await notifyQueue.add(
    "carBookReminder10h", // unique job name
    { userId, title: "Reminder", body: "Your booking is in 10 hours!" },
    { delay: Math.max(bookingTime - now - 10 * 60 * 60 * 1000, 0) }
  );

  // send 2 hours before
  await notifyQueue.add(
    "carBookReminder2h", // unique job name
    { userId, title: "Reminder", body: "Your booking is in 2 hours!" },
    { delay: Math.max(bookingTime - now - 2 * 60 * 60 * 1000, 0) }
  );

  //test purpose
  // await notifyQueue.add(
  //   "carBookReminder10h",
  //   { userId, title: "Reminder", body: "This is your 1-minute reminder!" },
  //   { delay: 1 * 60 * 1000 } // 1 min = 60000 ms
  // );

  // // send 2 minutes before (instead of 2h)
  // await notifyQueue.add(
  //   "carBookReminder2h",
  //   { userId, title: "Reminder", body: "This is your 2-minute reminder!" },
  //   { delay: 2 * 60 * 1000 } // 2 min = 120000 ms
  // );

  return;
};

const myCarBooks = async (userId: string) => {
  const results = await Carbook.find({
    user: userId,
  }).populate({
    path: "car",
    select: "carName carmodel description price carImages",
  });
  return results;
};

const getCarbookById = async (id: string) => {
  const result = await Carbook.findOne({ _id: id });
  return result;
};

const updateCarbook = async (id: string, data: Partial<TCarbook>) => {
  await Carbook.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteCarbook = async (id: string) => {
  await Carbook.findOneAndDelete({ _id: id });
  return;
};

const getCarBookings = async (query: any) => {
  const { page, limit, skip } = paginationHelper(query);
  const totalCount = await Carbook.countDocuments();
  const bookings = await Carbook.find()
    .limit(limit)
    .skip(skip)
    .populate("user", "_id fullName profileImage")
    .populate("car", "_id carName  carImages carType carModel price quantity");
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    bookings,
  };
};

export const carbookServices = {
  createCarbook,
  myCarBooks,
  getCarbookById,
  updateCarbook,
  deleteCarbook,
  getCarBookings,
};
