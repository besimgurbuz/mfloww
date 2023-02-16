import { SupportedPlatform } from '@mfloww/common';

export interface ProfileInfo {
  id: string;
  username: string;
  email: string;
  key: string;
  platform: SupportedPlatform;
}
