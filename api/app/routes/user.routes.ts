import { Router } from "express";
import { avatarUpload, resumeUpload } from "../lib/multer/index.js";
import { isAdmin, isSameUser, isSameUserOrAdmin } from "../middlewares/auth.js";
import { userController } from "../modules/users/controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", isAdmin, userController.getUsers);
userRouter.get("/:id", isSameUserOrAdmin, userController.getUser);

userRouter.patch("/:id", isSameUserOrAdmin, userController.updateUser);
userRouter.patch("/:id/password", isSameUser, userController.updatePassword);
userRouter.patch("/:id/role", isAdmin, userController.updateRole);

userRouter.put(
    "/:id/avatar",
    isSameUser,
    avatarUpload.single("avatar"),
    userController.updateAvatar
);
userRouter.put(
    "/:id/resume",
    isSameUser,
    resumeUpload.single("resume"),
    userController.updateResume
);

userRouter.delete("/:id", isSameUserOrAdmin, userController.deleteUser);

export default userRouter;
