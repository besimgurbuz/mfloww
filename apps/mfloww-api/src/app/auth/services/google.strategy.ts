import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/user/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(_, __, profile: { id: string; emails: { value: string }[] }) {
    const { id, emails } = profile;
    return {
      id,
      email: emails[0].value,
      username: this.generateUsernameFromEmail(emails[0].value),
    };
  }

  private generateUsernameFromEmail(email: string): string {
    return email.substring(0, email.indexOf('@'));
  }
}
