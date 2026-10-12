import Express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { role } from "./user.model";
import { fileUploader } from "../../utils/fileUploader";
import { parseBodyData } from "../../middleware/parseBodyData";

const router = Express.Router();

router.post("/create", userController.createUser);
router.post("/signup-verification", userController.signupVerification);
router.get("/userinfo/:userId", auth(), userController.userInfo);
router.get("/", auth(role.admin), userController.getUsers);
router.delete("/:userId", auth(role.admin), userController.deleteUser);
router.patch(
  "/:userId",
  auth(role.admin),
  fileUploader.profileImage,
  parseBodyData,
  userController.updateUser
);

export const userRoute = router;
