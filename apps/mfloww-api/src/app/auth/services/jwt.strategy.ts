import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      key: user.key,
    };
  }

  private static extractJwtFromCookie(req): string | null {
    if (req.cookies && 'XSRF-TOKEN' in req.cookies) {
      return req.cookies['XSRF-TOKEN'];
    }
    return null;
  }
}
