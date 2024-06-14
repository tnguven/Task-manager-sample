import { Pool } from "pg";
import { dbConfig } from "../config";

export const dbPool = new Pool(dbConfig);
