import { z } from "zod";

export const envSchema = z.object({
    PORT: z.string().default("3001"),

    DATABASE_URL: z
        .string()
        .url()
        .regex(/mongodb/),
    DB_PROTOCOL: z.string(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),

    JWT_SECRET: z.string(),
    EMAIL_SECRET: z.string(),

    FRONTEND_URL: z.string().url(),
    BACKEND_URL: z.string().url(),

    EMAIL_HOST: z.string(),
    EMAIL_PORT: z.string().transform((val) => Number(val)),
    EMAIL_SECURE: z.string().transform((val) => val === "true"),
    EMAIL_USER: z.string(),
    EMAIL_PASS: z.string(),
    EMAIL_FROM_NAME: z.string(),
    EMAIL_FROM_ADDRESS: z.string(),
});

export type EnvData = z.infer<typeof envSchema>;
