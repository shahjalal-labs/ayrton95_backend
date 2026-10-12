import AppError from "../../utils/AppError";
import { paginationHelper } from "../../utils/pagination";
import { uploadInSpace } from "../../utils/uploadInSpace";
import { TParts } from "./parts.interface";
import { Parts } from "./parts.model";

const createParts = async (
  data: TParts,
  userId: string,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const processImages = async (
    files: Express.Multer.File[],
    folder: string
  ) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `parts/${folder}`))
    );
  };

  const [partsImages] = await Promise.all([
    processImages(files?.partsImages, "partsImages"),
  ]);

  await Parts.create({
    ...data,
    user: userId,
    partsImages,
  });
  return;
};

const getAllParts = async (query: any) => {
  const { page, limit, skip } = paginationHelper(query);
  const [totalCount, results] = await Promise.all([
    Parts.countDocuments(),
    Parts.find().skip(skip).limit(limit),
  ]);
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    results,
  };
};

const getPartsById = async (id: string) => {
  const result = await Parts.findOne({ _id: id });
  return result;
};

const updateParts = async (
  id: string,
  data: Partial<TParts>,
  files: { [fieldname: string]: Express.Multer.File[] }
) => {
  const isExistParts = await Parts.findById({ _id: id });
  if (!isExistParts) {
    throw new AppError(404, "Car not found for update");
  }
  const processImages = async (
    files: Express.Multer.File[],
    folder: string
  ) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `parts/${folder}`))
    );
  };

  const [partsImages] = await Promise.all([
    processImages(files?.partsImages, "partsImages"),
  ]);
  await Parts.findOneAndUpdate(
    { _id: id },
    {
      ...data,
      partsImages: files ? partsImages : isExistParts.partsImages,
    },
    { new: true }
  );
  return;
};

const deleteParts = async (id: string) => {
  await Parts.findOneAndDelete({ _id: id });
  return;
};

export const carstoreServices = {
  createParts,
  getAllParts,
  getPartsById,
  updateParts,
  deleteParts,
};
