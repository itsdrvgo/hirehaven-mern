import { Router } from "express";
import { isAdmin } from "../middlewares/auth.js";
import { contactController } from "../modules/contacts/controllers/contact.controller.js";

const contactRouter = Router();

contactRouter.get("/", isAdmin, contactController.getContacts);
contactRouter.get("/:id", isAdmin, contactController.getContact);

contactRouter.post("/", contactController.createContact);
contactRouter.delete("/:id", isAdmin, contactController.deleteContact);

export default contactRouter;
