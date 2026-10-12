import { carstoreServices } from "./parts.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createParts = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  await carstoreServices.createParts(req.body, req.user.id, files);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Parts created successfully",
  });
});

const getAllParts = catchAsync(async (req, res) => {
  const result = await carstoreServices.getAllParts(req.query);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All parts fetched successfully",
    data: result,
  });
});

const getPartsById = catchAsync(async (req, res) => {
  const result = await carstoreServices.getPartsById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Single parts fetched successfully",
    data: result,
  });
});

const updateParts = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  await carstoreServices.updateParts(req.params.id, req.body, files);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parts updated successfully",
  });
});

const deleteParts = catchAsync(async (req, res) => {
  await carstoreServices.deleteParts(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Parts deleted successfully",
  });
});

export const partsControllers = {
  createParts,
  getAllParts,
  getPartsById,
  updateParts,
  deleteParts,
};
