import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

const ActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('CALENDAR_EVENT'),
    title: z.string(),
    date: z.string(),
    time: z.string().optional(),
    duration: z.string().optional(),
    description: z.string().optional(),
    attendees: z.array(z.string()).optional(),
  }),
  z.object({
    type: z.literal('SEND_EMAIL'),
    to: z.string(),
    subject: z.string(),
    body: z.string(),
  }),
  z.object({
    type: z.literal('CRM_UPDATE'),
    contact: z.string(),
    notes: z.string(),
    action: z.enum(['create', 'update', 'note']).optional(),
  }),
]);

export type ParsedAction = z.infer<typeof ActionSchema>;

export async function parseIntent(intent: string, context: Record<string, unknown> = {}): Promise<ParsedAction> {
  const model = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0,
  }).withStructuredOutput(ActionSchema);

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split('T')[0];

  const prompt = `Parse this user intent into a structured action.

Current date: ${currentDate}
Current year: ${currentYear}

Intent: "${intent}"
Context: ${JSON.stringify(context)}

Instructions:
- For CALENDAR_EVENT: Extract the event title, date (in ISO format YYYY-MM-DD), time (if specified), duration (if specified), description, and attendees (email addresses)
- For SEND_EMAIL: Extract the recipient email, subject, and body content
- For CRM_UPDATE: Extract the contact name/email and notes about the contact

Important:
- "tomorrow" means the day after current date
- If no specific time is mentioned, leave it optional
- Generate a sensible title for calendar events if not explicitly stated
- For emails, generate appropriate subject and body based on the intent`;

  const result = await model.invoke(prompt);
  return result;
}

export function getRequiredScopes(action: ParsedAction): string[] {
  switch (action.type) {
    case 'CALENDAR_EVENT':
      return ['https://www.googleapis.com/auth/calendar.events'];
    case 'SEND_EMAIL':
      return ['https://mail.google.com/'];
    case 'CRM_UPDATE':
      return [];
    default:
      return [];
  }
}

export function getActionDescription(action: ParsedAction): string {
  switch (action.type) {
    case 'CALENDAR_EVENT':
      return `Create calendar event: "${action.title}" on ${action.date}${action.time ? ` at ${action.time}` : ''}`;
    case 'SEND_EMAIL':
      return `Send email to ${action.to}: "${action.subject}"`;
    case 'CRM_UPDATE':
      return `Update CRM for ${action.contact}: ${action.notes}`;
    default:
      return 'Unknown action';
  }
}
