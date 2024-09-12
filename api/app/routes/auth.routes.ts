import { Router } from "express";
import { isAuth, isTokenValid } from "../middlewares/auth.js";
import { authController } from "../modules/auth/controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/me", isAuth, authController.currentUser);

authRouter.post("/signup", authController.signUp);
authRouter.post("/signin", authController.signIn);
authRouter.post("/signout", isAuth, authController.signOut);

authRouter.post("/verify-email", isTokenValid, authController.verifyAccount);
authRouter.post(
    "/resend-verification-email",
    isAuth,
    authController.resendVerificationEmail
);

export default authRouter;
