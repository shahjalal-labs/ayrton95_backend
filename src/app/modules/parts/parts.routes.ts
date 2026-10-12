import express from "express";
import auth from "../../middleware/auth";
import { role } from "../user/user.model";
import { fileUploader } from "../../utils/fileUploader";
import { parseBodyData } from "../../middleware/parseBodyData";
import { partsControllers } from "./parts.controller";

const router = express.Router();

router.post(
  "/create",
  auth(role.admin),
  fileUploader.uploadMultiple,
  parseBodyData,
  partsControllers.createParts
);
router.get("/", partsControllers.getAllParts);
router.get("/:id", partsControllers.getPartsById);
router.patch(
  "/:id",
  auth(role.admin),
  fileUploader.uploadMultiple,
  parseBodyData,
  partsControllers.updateParts
);
router.delete("/:id", auth(role.admin), partsControllers.deleteParts);

export const partsRoute = router;
