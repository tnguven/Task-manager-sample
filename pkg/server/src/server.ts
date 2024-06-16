import express from "express";
import logger from "pino-http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";

import { authenticateCookie } from "./middleware/authenticate";
import { router } from "./routes";

export const server = express();

server.use(logger())
server.use(cors());
server.use(helmet());
server.use(cookieParser());
server.use(authenticateCookie);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(compression());

server.use("/v1", router);
