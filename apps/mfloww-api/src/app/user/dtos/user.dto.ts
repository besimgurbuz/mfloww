export interface UserDto {
  username: string;
  email: string;
  password: string;
}

export type UserCreationResultDto =
  | {
      key: string;
      email: string;
      username: string;
    }
  | { error: string };

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
}
