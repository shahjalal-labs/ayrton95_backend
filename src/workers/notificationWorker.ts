import { Worker } from "bullmq";
import { sendNotification } from "../app/modules/notifications/notification.services";
import redisClient from "../app/utils/redis";
import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://accessfordev2:jvFRAyLBXnVQByha@cluster0.u9w31wp.mongodb.net/ayrton95";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Worker connected to MongoDB"))
  .catch((err) => console.error("❌ Worker failed to connect to MongoDB", err));

new Worker(
  "notifications",
  async (job) => {
    try {
      const { userId, title, body } = job.data;

      switch (job.name) {
        case "carBook":
          await sendNotification(userId, title, body);
          console.log(`✅ Immediate notification sent (jobId: ${job.id})`);
          break;

        case "carBookReminder10h":
          await sendNotification(userId, title, body);
          console.log(`✅ 10-hour reminder sent (jobId: ${job.id})`);
          break;

        case "carBookReminder2h":
          await sendNotification(userId, title, body);
          console.log(`✅ 2-hour reminder sent (jobId: ${job.id})`);
          break;

        default:
          console.warn(`⚠️ Unknown job: ${job.name}`);
      }
    } catch (err) {
      console.error("Job failed:", err);
      throw err;
    }
  },
  { connection: redisClient }
);
