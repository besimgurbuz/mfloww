import { SupportedPlatform } from '@mfloww/common';

export interface UserDto {
  username: string;
  email: string;
  password: string;
}

export interface PlatformUserDto {
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  platform: SupportedPlatform;
}

export type UserActionResult =
  | {
      key: string;
      email: string;
      username: string;
      platform?: SupportedPlatform;
    }
  | { error: string; reason?: unknown };

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
}

export interface ProfileInfoDto {
  username: string;
  email: string;
  key: string;
  platform: SupportedPlatform;
}
