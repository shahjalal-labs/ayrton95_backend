import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import sendResponse from "./app/utils/sendResponse";
import bodyParser from "body-parser";
import { bullBoardRouter } from "./bullBoard";
import basicAuth from "express-basic-auth";

const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://admin.mekarp.pt"],
    credentials: true,
  })
);

app.use("/api/v1", router);
app.use(
  "/admin/queues",
  basicAuth({
    users: { admin: process.env.BULLBOARD_PASSWORD || "supersecret" },
    challenge: true,
  }),
  bullBoardRouter
);
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "server is running now",
  });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
