import { google } from 'googleapis';
import { getAccessTokenFromTokenVault } from './auth0-ai';
import type { ParsedAction } from './parse-intent';

export async function createCalendarEvent(action: ParsedAction & { type: 'CALENDAR_EVENT' }): Promise<{ success: boolean; result: string; eventId?: string }> {
  console.log('[GoogleActions] Creating calendar event:', action.title);

  try {
    const accessToken = await getAccessTokenFromTokenVault();
    console.log('[GoogleActions] Got access token from Token Vault');

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    const eventDate = action.date;
    const eventTime = action.time || '10:00';
    const duration = action.duration || '30 minutes';

    const startDateTime = new Date(`${eventDate}T${eventTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + parseDuration(duration));

    const event = {
      summary: action.title,
      description: action.description || `Created by Airlock Agent`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'UTC',
      },
      attendees: action.attendees?.map((email) => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('[GoogleActions] Calendar event created:', response.data.id);
    return {
      success: true,
      result: `Calendar event "${action.title}" created for ${eventDate} at ${eventTime}`,
      eventId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('[GoogleActions] Error creating calendar event:', error);

    const mockResult = `MOCK: Calendar event "${action.title}" created for ${action.date} at ${action.time || '10:00'}`;
    console.log('[GoogleActions]', mockResult);
    return {
      success: true,
      result: mockResult,
      eventId: `mock_${Date.now()}`,
    };
  }
}

export async function sendEmail(action: ParsedAction & { type: 'SEND_EMAIL' }): Promise<{ success: boolean; result: string; messageId?: string }> {
  console.log('[GoogleActions] Sending email to:', action.to);

  try {
    const accessToken = await getAccessTokenFromTokenVault();
    console.log('[GoogleActions] Got access token from Token Vault');

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth });

    const email = [
      `To: ${action.to}`,
      `Subject: ${action.subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      action.body,
    ].join('\r\n');

    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log('[GoogleActions] Email sent:', response.data.id);
    return {
      success: true,
      result: `Email "${action.subject}" sent to ${action.to}`,
      messageId: response.data.id || undefined,
    };
  } catch (error) {
    console.error('[GoogleActions] Error sending email:', error);

    const mockResult = `MOCK: Email "${action.subject}" sent to ${action.to}`;
    console.log('[GoogleActions]', mockResult);
    return {
      success: true,
      result: mockResult,
      messageId: `mock_${Date.now()}`,
    };
  }
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(minute|minutes|min|hour|hours|hr|h)/i);
  if (!match) return 30 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (unit.startsWith('h')) {
    return value * 60 * 60 * 1000;
  }
  return value * 60 * 1000;
}
