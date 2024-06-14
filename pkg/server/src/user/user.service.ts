import type { HashPassword } from "../utils/hash-password";
import type { UserModel } from "./user.model";

import { Pool } from "pg";
import { secrets } from "../config";

export type UserServiceType = ReturnType<typeof makeUserService>;

const getUser = ([{ created_at, id, email }]: UserModel[]) => ({
  id,
  email,
  created_at,
});

export const makeUserService = ({
  dbPool,
  hashPassword,
}: {
  dbPool: Pool;
  hashPassword: HashPassword;
}) => ({
  async getUserById(id: number) {
    const { rows } = await dbPool.query<UserModel>("SELECT * FROM users WHERE id = $1", [id]);
    if (!rows.length) {
      console.log("No user found");
      return null;
    }

    return getUser(rows);
  },
  async getUserByEmail(email: string) {
    const { rows } = await dbPool.query<UserModel>("SELECT * FROM users WHERE email = $1", [email]);
    if (!rows.length) {
      console.log("No user found");
      return null;
    }

    return getUser(rows);
  },

  async getUserByEmailPassword(email: string, password: string) {
    const hashedPassword = hashPassword(email, password, secrets.token_secret);
    const { rows } = await dbPool.query<UserModel>(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, hashedPassword],
    );

    if (!rows.length) {
      console.log("No user found");
      return null;
    }

    return getUser(rows);
  },

  async deleteUserById(id: number) {
    const client = await dbPool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM users WHERE id = $1", [id]);
      await client.query("COMMIT");
      return id;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Transaction error occurs :", err);
      return err;
    } finally {
      client.release();
    }
  },

  async createUser({ email, password }: { email: string; password: string }) {
    const hashedPassword = hashPassword(email, password, secrets.token_secret);
    const { rows } = await dbPool.query<UserModel>(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword],
    );

    return getUser(rows);
  },
});
