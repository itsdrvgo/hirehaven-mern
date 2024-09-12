import multer from "multer";
import { AppError } from "../helpers/index.js";
import { ACCEPTED_IMAGE_TYPES } from "../../config/const.js";
import { generateFilename } from "../utils.js";
import fs from "fs";

const dir = "uploads/images/avatars/";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => cb(null, generateFilename(file)),
});

export const avatarUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 2, // 2MB
    },
    fileFilter: (_, file, cb) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype))
            return cb(new AppError("Invalid file type", "BAD_REQUEST"));

        cb(null, true);
    },
});
