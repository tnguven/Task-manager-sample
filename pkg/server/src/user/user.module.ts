import { dbPool } from "../db/connect";
import { makeDeleteUserByID, makeCreateUser, makeLoginUser, makeGetUser } from "./user.controller";
import { makeUserService } from "./user.service";
import { hashPassword } from "../utils/hash-password";

const service = makeUserService({ dbPool, hashPassword });

export const deleteUserByID = makeDeleteUserByID(service);
export const createUser = makeCreateUser(service);
export const loginUser = makeLoginUser(service);
export const getUser = makeGetUser(service);

export { logoutUser } from "./user.controller";
