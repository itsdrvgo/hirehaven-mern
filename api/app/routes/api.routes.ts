import { Router } from "express";

import { isAuth } from "../middlewares/auth.js";
import applicationRouter from "./application.routes.js";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import contactRouter from "./contact.routes.js";
import cookieRouter from "./cookie.routes.js";
import jobRouter from "./job.routes.js";
import userRouter from "./user.routes.js";

const apiRouter = Router();

apiRouter.use("/applications", isAuth, applicationRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/contacts", isAuth, contactRouter);
apiRouter.use("/cookies", cookieRouter);
apiRouter.use("/jobs", jobRouter);
apiRouter.use("/users", isAuth, userRouter);

export { apiRouter };
