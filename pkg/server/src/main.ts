import { serverConfig } from "./config";
import { server } from "./server";
import { exitHandler } from "./utils/exit-handlers";
import { dbPool } from "./db/connect";
import { logger } from "./logger";

const app = server.listen(serverConfig.port, () => {
  logger.info("start listening :", serverConfig.port);
});

exitHandler(async () => {
  await dbPool.end();
  app.close(() => process.exit(1));
});
