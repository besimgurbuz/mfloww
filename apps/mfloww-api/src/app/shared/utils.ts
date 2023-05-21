import { pbkdf2Sync } from 'crypto';

export function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}
