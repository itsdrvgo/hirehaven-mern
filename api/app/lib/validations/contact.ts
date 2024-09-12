import Joi from "joi";
import type { ContactData } from "../../interfaces/index.js";

export const contactSchema = Joi.object<ContactData>({
    userId: Joi.string().required(),
    query: Joi.string().required(),
    message: Joi.string().required(),
});

export const createContactSchema = contactSchema;
