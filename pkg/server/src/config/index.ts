import { resolve } from "path";
import dotEnv from "dotenv";
import { PoolConfig } from "pg";

const isDevelopment = process.env.NODE_ENV !== "production";

dotEnv.config({
  ...(isDevelopment && { path: resolve(__dirname, "../../../.env") }),
});

export const dbConfig: PoolConfig = {
  user: process.env.DB_USERNAME || "admin",
  database: process.env.DB_NAME || "task",
  password: process.env.DB_PASSWORD || "admin",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  query_timeout: 3000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 3000,
};

export const serverConfig = <const>{
  port: process.env.PORT || 8080,
  tokenMaxAge: 60 * 10, // 10 min
};

export const secrets = <const>{
  token_secret:
    process.env.TOKEN_SECRET || "ac1fd9fd2bb74e0280bd302",
};
