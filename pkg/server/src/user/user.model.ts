export type User = { id: number };

export type UserModel = User & {
  email: string;
  created_at: Date;
  password?: string;
}