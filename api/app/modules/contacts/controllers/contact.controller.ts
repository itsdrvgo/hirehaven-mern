import type { Request, Response } from "express";
import { AppError } from "../../../lib/helpers/index.js";
import { CResponse, handleError } from "../../../lib/utils.js";
import {
    createContactSchema,
    queryInfiniteSchema,
} from "../../../lib/validations/index.js";
import { contactRepo } from "../repositories/contact.repo.js";

class ContactController {
    getContacts = async (req: Request, res: Response) => {
        try {
            const { error, value } = queryInfiniteSchema.validate(req.query);
            if (error) throw error;

            const { page, limit, paginated } = value;

            if (!paginated) {
                const contacts = await contactRepo.get();

                return CResponse({
                    res,
                    message: "OK",
                    data: contacts,
                });
            } else {
                const contacts = await contactRepo.getInfinite({
                    options: {
                        page: page,
                        limit: limit,
                    },
                });

                return CResponse({
                    res,
                    message: "OK",
                    data: contacts,
                });
            }
        } catch (err) {
            return handleError(err, res);
        }
    };

    getContact = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const contact = await contactRepo.getById(id!);
            if (!contact) throw new AppError("Contact not found", "NOT_FOUND");

            return CResponse({
                res,
                message: "OK",
                data: contact,
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    createContact = async (req: Request, res: Response) => {
        try {
            const { error, value } = createContactSchema.validate(req.body);
            if (error) throw error;

            await contactRepo.create(value);

            return CResponse({
                res,
                message: "CREATED",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };

    deleteContact = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existingContact = await contactRepo.getById(id!);
            if (!existingContact)
                throw new AppError("Contact not found", "NOT_FOUND");

            await contactRepo.delete(existingContact.id);

            return CResponse({
                res,
                message: "OK",
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const contactController = new ContactController();
