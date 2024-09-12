import { Router } from "express";
import { categoryController } from "../modules/categories/controllers/category.controller.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:id", categoryController.getCategory);

categoryRouter.post("/", isAuth, isAdmin, categoryController.createCategory);

categoryRouter.patch(
    "/:id",
    isAuth,
    isAdmin,
    categoryController.updateCategory
);

categoryRouter.delete(
    "/:id",
    isAuth,
    isAdmin,
    categoryController.deleteCategory
);

export default categoryRouter;
