import { Router } from "express";
import { logoUpload } from "../lib/multer/logo.js";
import { isAuth, isPoster, isSeeker } from "../middlewares/auth.js";
import { jobController } from "../modules/jobs/controllers/job.controller.js";

const jobRouter = Router();

jobRouter.get("/", jobController.getJobs);
jobRouter.get("/:id", jobController.getJob);

jobRouter.post(
    "/",
    isAuth,
    isPoster,
    logoUpload.single("logo"),
    jobController.createJob
);
jobRouter.post("/:id/apply", isAuth, isSeeker, jobController.applyToJob);

jobRouter.patch("/:id", isAuth, isPoster, jobController.updateJob);

jobRouter.delete("/:id", isAuth, isPoster, jobController.deleteJob);

export default jobRouter;
