import { Router } from "express";

import { withAuthentication } from "../middleware/withAuthentication";
import { router as tasksRoute } from "./tasks";
import { router as userRoute } from "./user";

export const router = Router();

router.use("/task", withAuthentication, tasksRoute);
router.use("/user", userRoute);
