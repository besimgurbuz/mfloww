import { SupportedPlatform } from '@mfloww/common';

export type UserInfo = {
  id: string;
  key: string;
} & (
  | {
      username: string;
      email: string;
      platform: SupportedPlatform;
      isAnonymous: never | false;
    }
  | {
      isAnonymous: true;
    }
);
