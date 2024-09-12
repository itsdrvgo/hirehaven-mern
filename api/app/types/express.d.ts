import type { DefaultPayload } from "../interfaces/index.ts";

declare module "express-serve-static-core" {
    interface Request {
        ctx?: {
            user: DefaultPayload;
        };
    }
}
