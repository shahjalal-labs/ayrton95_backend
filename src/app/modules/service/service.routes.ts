import express from "express";
import { serviceControllers } from "./service.controller";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";
import { fileUploader } from "../../utils/fileUploader";
import { parseBodyData } from "../../middleware/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  auth(role.pro),
  fileUploader.servicePhoto,
  parseBodyData,
  serviceControllers.createService
);
router.get("/my-services", auth(role.pro), serviceControllers.myServices);
router.get("/:id", serviceControllers.getServiceById);
router.patch(
  "/:id",
  auth(role.admin, role.pro),
  serviceControllers.updateService
);
router.delete(
  "/:id",
  auth(role.admin, role.pro),
  serviceControllers.deleteService
);
router.get("/", auth(), serviceControllers.allServices);
router.get("/all/services", auth(role.admin), serviceControllers.getServices);

export const serviceRoutes = router;
