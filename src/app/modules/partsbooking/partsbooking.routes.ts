import express from "express";
import { partsBookingControllers } from "./partsbooking.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/create/:partsId",
  auth(role.user, role.pro),
  partsBookingControllers.createPartsBooking
);
router.get(
  "/my-bookings",
  auth(role.user, role.pro),
  partsBookingControllers.userPartsBookingList
);
router.get("/", auth(role.admin), partsBookingControllers.partsBookingList);
router.get("/:id", auth(), partsBookingControllers.getBookingById);
router.patch(
  "/cancel-booking-user/:bookingId",
  auth(role.admin),
  partsBookingControllers.cancelBookingByUser
);
router.patch("/:id", auth(role.admin), partsBookingControllers.updateBooking);
router.delete("/:id", auth(role.admin), partsBookingControllers.deleteBooking);

export const partsBookingRoutes = router;
