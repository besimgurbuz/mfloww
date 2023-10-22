import { User } from '@prisma/client';
import { randomBytes } from 'crypto';
import {
  H3Event,
  createError,
  eventHandler,
  readBody,
  sendError,
  setCookie,
} from 'h3';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../prisma';
import type { GoogleTokenResponse, GoogleUserInfo } from './models';

async function authWithGoogle(event: H3Event) {
  const body = await readBody(event);

  if (!body?.code) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "'code' is missing",
      }),
      process.env['VITE_PRODUCTION'] === 'false'
    );
    return null;
  }

  const userData = await getUserDataFromGoogle(event, body.code);
  if (!userData) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Platform.Google.Unauth',
      }),
      process.env['VITE_PRODUCTION'] === 'false'
    );
    return null;
  }

  const savedUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (savedUser) {
    if (savedUser.platform === 'NONE') {
      await prisma.user.update({
        where: {
          email: userData.email,
        },
        data: {
          platform: 'GOOGLE',
        },
      });
      savedUser.platform = 'GOOGLE';
    }
    const token = jwt.sign(savedUser, process.env['JWT_SECRET'] as string);
    setCookie(event, 'TOKEN', token, { httpOnly: true, sameSite: 'strict' });
    return savedUser;
  }

  userData.key = randomBytes(64).toString('hex');
  const newPlatformUser = await prisma.user.create({
    data: userData as User,
  });
  const token = jwt.sign(newPlatformUser, process.env['JWT_SECRET'] as string);
  setCookie(event, 'TOKEN', token, { httpOnly: true, sameSite: 'strict' });
  return newPlatformUser;
}

async function getUserDataFromGoogle(
  event: H3Event,
  code: string
): Promise<Partial<User> | undefined> {
  const tokenBody = await exchangeGoogleAuthCodeWithAccessToken(code);
  const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
    headers: {
      Authorization: `${tokenBody.token_type} ${tokenBody.access_token}`,
    },
  });

  if (!res.ok) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: 'Platform.Google.Unauth',
      })
    );
    return;
  }
  const googleUserInfo = (await res.json()) as GoogleUserInfo;
  return {
    email: googleUserInfo.email,
    platform: 'GOOGLE',
    username: googleUserInfo.email.substring(
      0,
      googleUserInfo.email.indexOf('@')
    ),
  };
}

async function exchangeGoogleAuthCodeWithAccessToken(code: string) {
  const url = new URL('https://oauth2.googleapis.com/token');
  url.searchParams.append('code', code);
  url.searchParams.append(
    'client_id',
    process.env['VITE_GOOGLE_CLIENT_ID'] as string
  );
  url.searchParams.append(
    'client_secret',
    process.env['GOOGLE_CLIENT_SECRET'] as string
  );
  url.searchParams.append(
    'redirect_uri',
    `${process.env['VITE_ANALOG_PUBLIC_BASE_URL']}/platform-redirect/google`
  );
  url.searchParams.append('grant_type', 'authorization_code');

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const body = await res.json();

  return body as GoogleTokenResponse;
}

export default eventHandler(authWithGoogle);
