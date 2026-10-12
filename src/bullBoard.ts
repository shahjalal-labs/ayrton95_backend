import { ExpressAdapter } from "@bull-board/express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { notifyQueue } from "./queues/notification";

// Express adapter
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

// Create Bull Board
createBullBoard({
  queues: [new BullMQAdapter(notifyQueue)], // register your queue here
  serverAdapter,
});

// Export router for your Express app
export const bullBoardRouter = serverAdapter.getRouter();
