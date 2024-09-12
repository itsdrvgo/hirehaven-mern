import fs from "fs";
import multer from "multer";
import { ACCEPTED_FILE_TYPES } from "../../config/const.js";
import { AppError } from "../helpers/index.js";
import { generateFilename } from "../utils.js";

const dir = "uploads/files/resumes/";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),
    filename: (_, file, cb) => cb(null, generateFilename(file)),
});

export const resumeUpload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (_, file, cb) => {
        if (!ACCEPTED_FILE_TYPES.includes(file.mimetype))
            return cb(new AppError("Invalid file type", "BAD_REQUEST"));

        cb(null, true);
    },
});
