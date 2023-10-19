import {
  H3Event,
  createError,
  defineEventHandler,
  getRouterParam,
  sendError,
} from 'h3';
import authWithGoogle from './google';

export default defineEventHandler(async (event: H3Event) => {
  const platform = getRouterParam(event, 'platform');

  if (platform === 'google') {
    return await authWithGoogle(event);
  }

  sendError(
    event,
    createError({
      statusCode: 400,
      statusMessage: `unsupported platform sent ${platform}`,
    }),
    process.env['VITE_PRODUCTION'] === 'false'
  );
});
