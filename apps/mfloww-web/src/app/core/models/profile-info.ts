import { SupportedPlatform } from '@mfloww/common';

export interface ProfileInfo {
  username: string;
  email: string;
  key: string;
  platform: SupportedPlatform;
}
