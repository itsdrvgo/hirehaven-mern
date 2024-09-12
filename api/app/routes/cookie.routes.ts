import { Router } from "express";
import { cookieController } from "../modules/cookies/cookie.controller.js";

const cookieRouter = Router();

cookieRouter.get("/", cookieController.getValidCookies);

export default cookieRouter;
