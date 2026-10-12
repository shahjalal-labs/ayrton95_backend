import AppError from "../../utils/AppError";
import admin from "../../utils/firebaseAdmin";
import { User } from "../user/user.model";
import { Notification } from "./notification.model";
import mongoose from "mongoose";

export const sendNotification = async (
  userId: string,
  title: string,
  body: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid userId:", userId);
    return;
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const userInfo = await User.findById(userObjectId).lean();

  await Notification.create({
    user: userObjectId,
    title,
    body,
  });

  if (userInfo?.fcmToken) {
    await admin.messaging().send({
      notification: { title, body },
      token: userInfo.fcmToken,
    });
    return;
  }
};

const getNotificationsFromDB = async (userId: string) => {
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  if (notifications.length === 0) {
    throw new AppError(404, "No notifications found for the user");
  }

  return notifications;
};

const getSingleNotificationFromDB = async (notificationId: string) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new AppError(404, "Notification not found for the user");
  }

  await Notification.findByIdAndUpdate(notificationId, { read: true });
  return notification;
};

export const notificationServices = {
  getNotificationsFromDB,
  getSingleNotificationFromDB,
};
