import "dotenv/config";
import express from "express";
import BP from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./app/routes/index.js";
import { initiateErrorHandler, logger } from "./app/lib/helpers/index.js";
import { db } from "./app/lib/db/index.js";

const app = express();

db.connect();

app.use(BP.json());
app.use(BP.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));

app.use("/api", apiRouter);

const url =
    process.env.NODE_ENV === "production"
        ? process.env.BACKEND_URL
        : `http://localhost:${process.env.PORT}`;

app.listen(process.env.PORT, async () => {
    initiateErrorHandler();
    logger.info(`Server running on ${url}`);
});
