import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP Send Successfully",
    data: user,
  });
});

const signupVerification = catchAsync(async (req, res) => {
  await userService.signupVerification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfull",
  });
});

const userInfo = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await userService.userInfo(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Userinfo retrived successfull",
    data: user,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getUsers(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrived successfull",
    data: users,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await userService.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User deleted successfull",
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  await userService.updateUser(
    userId,
    req.body,
    req.file as Express.Multer.File
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfull",
  });
});

export const userController = {
  createUser,
  signupVerification,
  userInfo,
  getUsers,
  deleteUser,
  updateUser,
};
