export interface UserDto {
  username: string;
  email: string;
  password: string;
}

export type UserActionResult =
  | {
      key: string;
      email: string;
      username: string;
    }
  | { error: string; reason?: any };

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
}

export interface ProfileInfoDto {
  username: string;
  email: string;
}
