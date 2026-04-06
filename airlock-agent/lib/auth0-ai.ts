import { Auth0AI, getAccessTokenFromTokenVault } from '@auth0/ai-vercel';
import { getRefreshToken } from './auth0';

export const getAccessToken = async () => getAccessTokenFromTokenVault();

const auth0AI = new Auth0AI();

export const withGoogleCalendarConnection = auth0AI.withTokenVault({
  connection: 'google-oauth2',
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
  refreshToken: getRefreshToken,
});

export const withGmailConnection = auth0AI.withTokenVault({
  connection: 'google-oauth2',
  scopes: ['https://mail.google.com/'],
  refreshToken: getRefreshToken,
});

export { getAccessTokenFromTokenVault };
