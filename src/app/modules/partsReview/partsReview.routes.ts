import express from "express";
import { partsReviewControllers } from "./partsReview.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";

const router = express.Router();

router.post(
  "/create/:bookingId",
  auth(role.user, role.pro),
  partsReviewControllers.createReview
);
router.get("/", auth(), partsReviewControllers.getAllReviews);
router.get("/:id", auth(), partsReviewControllers.getReviewById);
router.patch("/:id", auth(), partsReviewControllers.updateReview);
router.delete("/:id", auth(), partsReviewControllers.deleteReview);

export const partsReviewRoutes = router;
