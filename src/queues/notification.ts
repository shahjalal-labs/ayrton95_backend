import { Queue } from "bullmq";
import Redis from "ioredis";

const bullRedis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const notifyQueue = new Queue("notifications", {
  connection: bullRedis,
});

bullRedis.on("connect", () => console.log("BullMQ Redis connected"));
bullRedis.on("error", (err) => console.error("BullMQ Redis error:", err));
