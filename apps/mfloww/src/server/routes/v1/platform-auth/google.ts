import { PlatformUser } from '@prisma/client';
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

  const userData = await getPlatformUserDataFromGoogle(event, body.code);
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

  const savedPlatformUser = await prisma.platformUser.findUnique({
    where: { email: userData.email },
  });

  if (savedPlatformUser) {
    await prisma.platformUser.update({
      where: {
        email: userData.email,
      },
      data: {
        accessToken: userData.accessToken,
      },
    });
    const token = jwt.sign(
      savedPlatformUser,
      process.env['JWT_SECRET'] as string
    );
    setCookie(event, 'TOKEN', token, { httpOnly: true, sameSite: 'strict' });
    return savedPlatformUser;
  }

  userData.key = randomBytes(64).toString('hex');
  const newPlatformUser = await prisma.platformUser.create({
    data: userData as PlatformUser,
  });
  const token = jwt.sign(newPlatformUser, process.env['JWT_SECRET'] as string);
  setCookie(event, 'TOKEN', token, { httpOnly: true, sameSite: 'strict' });
  return newPlatformUser;
}

async function getPlatformUserDataFromGoogle(
  event: H3Event,
  code: string
): Promise<Partial<PlatformUser> | undefined> {
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
    accessToken: tokenBody.access_token,
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

  return body as TokenResponse;
}

type TokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
};

type GoogleUserInfo = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export default eventHandler(authWithGoogle);
