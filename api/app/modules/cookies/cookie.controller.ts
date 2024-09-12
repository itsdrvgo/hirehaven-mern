import type { Request, Response } from "express";
import { TOKENS } from "../../config/const.js";
import { CResponse, handleError } from "../../lib/utils.js";

class CookieController {
    getValidCookies = (req: Request, res: Response) => {
        try {
            const cookies = req.cookies;

            return CResponse({
                res,
                message: "OK",
                data: {
                    seeker: cookies[TOKENS.SEEKER_TOKEN],
                    poster: cookies[TOKENS.POSTER_TOKEN],
                    admin: cookies[TOKENS.ADMIN_TOKEN],
                },
            });
        } catch (err) {
            return handleError(err, res);
        }
    };
}

export const cookieController = new CookieController();
