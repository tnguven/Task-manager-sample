import { Pool } from "pg";
import { dbConfig } from "../config";

export const dbPool = new Pool(dbConfig);

// export const connectDb = async (): Promise<Pool> => {
//   try {
//     await dbClient.connect();
//     console.log("\x1b[92m", `\nCONNECTED TO [${dbConfig.database}]: database ✅\n`, "\x1b[0m");
//   } catch (err) {
//     console.error(
//       "\x1b[91m",
//       `\nCONNECTION FAILED TO [${dbConfig.database}] database ⛔\n`,
//       "\x1b[0m",
//       err,
//     );
//     throw err;
//   }

//   return dbClient;
// };
