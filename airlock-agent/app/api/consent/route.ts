import { NextRequest, NextResponse } from 'next/server';
import { actionStore } from '@/lib/action-store';
import { createCalendarEvent, sendEmail } from '@/lib/google-actions';
import type { ParsedAction } from '@/lib/parse-intent';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const pendingActions = actionStore.getPendingActions(userId);
  return NextResponse.json({ pendingActions });
}

async function executeAction(action: ParsedAction, userId: string, intent: string): Promise<string> {
  let result: string;
  let scope: string;

  switch (action.type) {
    case 'CALENDAR_EVENT': {
      scope = 'https://www.googleapis.com/auth/calendar.events';
      const response = await createCalendarEvent(action);
      result = response.result;

      actionStore.addActionLog({
        userId,
        intent,
        actionType: 'CALENDAR_EVENT',
        scope,
        status: response.success ? 'success' : 'error',
        result: response.result,
        tokenSource: 'Token Vault',
      });
      break;
    }

    case 'SEND_EMAIL': {
      scope = 'https://mail.google.com/';
      const response = await sendEmail(action);
      result = response.result;

      actionStore.addActionLog({
        userId,
        intent,
        actionType: 'SEND_EMAIL',
        scope,
        status: response.success ? 'success' : 'error',
        result: response.result,
        tokenSource: 'Token Vault',
      });
      break;
    }

    case 'CRM_UPDATE': {
      scope = 'crm:write';
      result = `MOCK: CRM updated for ${action.contact} with notes: ${action.notes}`;
      console.log('[Consent]', result);

      actionStore.addActionLog({
        userId,
        intent,
        actionType: 'CRM_UPDATE',
        scope,
        status: 'mocked',
        result,
        tokenSource: 'Mock',
      });
      break;
    }

    default:
      throw new Error(`Unknown action type`);
  }

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionId, decision, userId } = body;

    if (!actionId || !decision || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const action = actionStore.getPendingAction(actionId);
    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    if (action.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (decision === 'deny') {
      actionStore.denyAction(actionId);
      return NextResponse.json({ status: 'denied', actionId });
    }

    actionStore.approveAction(actionId);
    actionStore.grantScopes(userId, action.scopes);

    const result = await executeAction(action.action as ParsedAction, userId, action.intent);
    actionStore.markExecuted(actionId);

    return NextResponse.json({
      status: 'executed',
      actionId,
      result,
    });
  } catch (error) {
    console.error('[Consent API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process consent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
