import { type EnvData, envSchema } from "../lib/validations/index.ts";

envSchema.parse(process.env);

declare global {
    declare namespace NodeJS {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface ProcessEnv extends EnvData {}
    }

    type ValueOf<T> = T[keyof T];
}
