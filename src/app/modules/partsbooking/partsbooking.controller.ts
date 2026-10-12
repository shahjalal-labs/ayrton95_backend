import { bookingParts } from "./partsbooking.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createPartsBooking = catchAsync(async (req, res) => {
  await bookingParts.createPartsBooking(
    req.body,
    req.user.id,
    req.params.partsId
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Parts booked successfully",
  });
});

const userPartsBookingList = catchAsync(async (req, res) => {
  const { bookingStatus } = req.query as any;
  const result = await bookingParts.userPartsBookingList(
    req.user.id,
    bookingStatus
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Your parts bookings retrived successfully",
    data: result,
  });
});

const partsBookingList = catchAsync(async (req, res) => {
  const { bookingStatus } = req.query as any;
  const result = await bookingParts.partsBookingList(bookingStatus, req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parts bookings retrived successfully",
    data: result,
  });
});

const cancelBookingByUser = catchAsync(async (req, res) => {
  await bookingParts.cancelBookingByUser(req.params.bookingId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking cancelled successfully",
  });
});

const getBookingById = catchAsync(async (req, res) => {
  const result = await bookingParts.getBookingById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking fetched successfully",
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  await bookingParts.updateBooking(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking updated successfully",
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingParts.deleteBooking(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Booking deleted successfully",
  });
});

export const partsBookingControllers = {
  createPartsBooking,
  userPartsBookingList,
  partsBookingList,
  cancelBookingByUser,
  getBookingById,
  updateBooking,
  deleteBooking,
};
