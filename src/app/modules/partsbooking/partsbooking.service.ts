import AppError from "../../utils/AppError";
import { paginationHelper } from "../../utils/pagination";
import stripe from "../../utils/stripe";
import { Parts } from "../parts/parts.model";
import { User } from "../user/user.model";
import { TPartsBooking } from "./partsbooking.interface";
import { PartsBooking } from "./partsbooking.model";

const createPartsBooking = async (
  data: TPartsBooking,
  userId: string,
  partsId: string
) => {
  const isPartsExist = await Parts.findById({
    _id: partsId,
  });
  if (!isPartsExist) {
    throw new AppError(404, "Parts Not Found");
  }

  const userInfo = await User.findById({
    _id: userId,
  });
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  let customerId = userInfo.customerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: userInfo.fullName,
      email: userInfo.email,
    });
    customerId = customer.id;

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        customerId,
      },
      {
        new: true,
      }
    );

    await stripe.paymentMethods.attach(data.paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: data.paymentMethodId,
      },
    });
  }
  await stripe.paymentMethods.attach(data.paymentMethodId, {
    customer: customerId,
  });
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: data.paymentMethodId,
    },
  });

  // console.log(isPartsExist.price, data.quantity);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: isPartsExist.price * 100 * data.quantity,
    currency: "usd",
    payment_method: data.paymentMethodId,
    customer: customerId,
    confirm: true,
    description: `Payment success for ${isPartsExist.partsName}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status === "succeeded") {
    await PartsBooking.create({
      ...data,
      user: userId,
      parts: partsId,
      paymentStatus: true,
    });
    return;
  }
  throw new AppError(400, "Payment failed");
};

const userPartsBookingList = async (userId: string, bookingStatus: string) => {
  const bookings = await PartsBooking.find({
    user: userId,
    bookingStatus,
  }).populate({
    path: "parts",
    select: "_id partsName partsImages price quantity partsreviews",
    populate: {
      path: "partsreviews",
      select: "rating",
    },
  });

  const results = bookings.map((booking) => {
    let parts: any = booking.parts;
    if (parts && typeof parts.toObject === "function") {
      parts = parts.toObject();
    }
    const reviews = parts.partsreviews || [];
    const totalRating = reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    // Remove reviews array before returning
    const { partsreviews, ...serviceWithoutReviews } = parts;

    return {
      ...booking.toObject(),
      parts: {
        ...serviceWithoutReviews,
        avgRating,
      },
    };
  });

  return results;
};

const partsBookingList = async (bookingStatus: string, query: any) => {
  const { page, limit, skip } = paginationHelper(query);
  const bookings = await PartsBooking.find({
    bookingStatus,
  })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "parts",
      select: "_id partsName partsImages price quantity partsreviews",
      populate: {
        path: "partsreviews",
        select: "rating",
      },
    })
    .populate("user", "_id  fullName profileImage");

  const totalCount = await PartsBooking.countDocuments({ bookingStatus });

  const results = bookings.map((booking) => {
    let parts: any = booking.parts;
    if (parts && typeof parts.toObject === "function") {
      parts = parts.toObject();
    }
    const reviews = parts.partsreviews || [];
    const totalRating = reviews.reduce(
      (sum: number, r: any) => sum + (r.rating || 0),
      0
    );
    const avgRating = reviews.length ? totalRating / reviews.length : 0;

    // Remove reviews before returning
    const { partsreviews: _, ...serviceWithoutReviews } = parts;

    return {
      ...booking.toObject(),
      parts: {
        ...serviceWithoutReviews,
        avgRating,
      },
    };
  });

  return {
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    bookings: results,
  };
};

const cancelBookingByUser = async (bookingId: string) => {
  await PartsBooking.findByIdAndUpdate(
    { _id: bookingId },
    {
      bookingStatus: "CancelByUser",
    },
    { new: true }
  );
  return;
};

const getBookingById = async (id: string) => {
  const result = await PartsBooking.findOne({ _id: id });
  return result;
};

const updateBooking = async (id: string, data: Partial<TPartsBooking>) => {
  await PartsBooking.findOneAndUpdate({ _id: id }, data, { new: true });
  return;
};

const deleteBooking = async (id: string) => {
  await PartsBooking.findOneAndDelete({ _id: id });
  return;
};

export const bookingParts = {
  createPartsBooking,
  userPartsBookingList,
  partsBookingList,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBookingByUser,
};
