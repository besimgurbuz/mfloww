export interface User {
  key: string;
  email: string;
  username: string;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
}

export type CreateUserResult =
  | User
  | {
      error: string;
      reason: string;
    };

export type UserLoginResult = {
  access_token: string;
  key: string;
  expiresIn: number;
} & { statusCode: number; message: string };
