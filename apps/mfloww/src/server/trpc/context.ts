import { inferAsyncReturnType } from '@trpc/server';
import { IncomingMessage, ServerResponse } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from 'process';
import { prisma } from '../prisma';
import { parseCookie } from '../util';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  async function getUserFromCookie() {
    try {
      const cookies = parseCookie(req.headers.cookie);
      const token = cookies['TOKEN'];
      console.log('cookie control', token);
      const decoded = jwt.verify(
        token,
        env['JWT_SECRET'] as string
      ) as JwtPayload;
      console.log('decoded', decoded);

      if (decoded['isAnonymous']) {
        return decoded;
      }

      const user = await prisma.user.findFirstOrThrow({
        where: { id: decoded['id'], key: decoded['key'] },
      });

      return user;
    } catch (err) {
      return null;
    }
  }

  function setCookie(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
      path?: string;
    }
  ) {
    let cookie = `${name}=${value}; Path=${options?.path || '/'}`;

    if (options?.httpOnly) {
      cookie = `${cookie}; HttpOnly`;
    }
    if (options?.sameSite) {
      cookie = `${cookie}; SameSite=${options?.sameSite}`;
    }

    res.setHeader('Set-Cookie', cookie);
  }

  function getCookie() {
    return parseCookie(req.headers.cookie);
  }

  return { user: await getUserFromCookie(), getCookie, setCookie };
};
export type Context = inferAsyncReturnType<typeof createContext>;
