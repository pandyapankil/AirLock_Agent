import { ChatOpenAI } from '@langchain/openai';

export type ActionType = 'CALENDAR_EVENT' | 'SEND_EMAIL' | 'CRM_UPDATE';

export interface CalendarAction {
  type: 'CALENDAR_EVENT';
  title: string;
  date: string;
  time?: string;
  duration?: string;
  description?: string;
  attendees?: string[];
}

export interface EmailAction {
  type: 'SEND_EMAIL';
  to: string;
  subject: string;
  body: string;
}

export interface CRMAction {
  type: 'CRM_UPDATE';
  contact: string;
  notes: string;
  action?: 'create' | 'update' | 'note';
}

export type ParsedAction = CalendarAction | EmailAction | CRMAction;

export async function parseIntent(intent: string, context: Record<string, unknown> = {}): Promise<ParsedAction> {
  const model = new ChatOpenAI({
    model: 'glm-4-flash',
    temperature: 0,
    configuration: {
      baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    },
  });

  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toISOString().split('T')[0];

  const prompt = `Parse this user intent into a structured action and return ONLY a valid JSON object with no additional text.

Current date: ${currentDate}
Current year: ${currentYear}

Intent: "${intent}"

Instructions:
- For CALENDAR_EVENT: Return { type: "CALENDAR_EVENT", title: "event title", date: "YYYY-MM-DD", time: "HH:MM", duration: "X minutes", description: "optional", attendees: ["email@example.com"] }
- For SEND_EMAIL: Return { type: "SEND_EMAIL", to: "email", subject: "subject", body: "email body" }
- For CRM_UPDATE: Return { type: "CRM_UPDATE", contact: "name", notes: "notes", action: "update" }

Important:
- "tomorrow" means ${new Date(Date.now() + 86400000).toISOString().split('T')[0]}
- Return ONLY the JSON object, no explanations`;

  const result = await model.invoke(prompt);
  const content = typeof result.content === 'string' ? result.content : JSON.stringify(result.content);
  
  try {
    const parsed = JSON.parse(content.trim());
    return parsed as ParsedAction;
  } catch {
    return {
      type: 'CALENDAR_EVENT',
      title: intent,
      date: currentDate,
    };
  }
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