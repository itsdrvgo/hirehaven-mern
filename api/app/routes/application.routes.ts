import { Router } from "express";
import { isPoster } from "../middlewares/auth.js";
import { applicationController } from "../modules/applications/controllers/application.controller.js";

const applicationRouter = Router();

applicationRouter.get("/", applicationController.getApplications);
applicationRouter.get("/:id", applicationController.getApplication);

applicationRouter.patch(
    "/:id",
    isPoster,
    applicationController.updateApplication
);

export default applicationRouter;
