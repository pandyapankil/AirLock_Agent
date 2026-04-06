import { NextRequest, NextResponse } from 'next/server';
import { parseIntent, getRequiredScopes, getActionDescription, ParsedAction } from '@/lib/parse-intent';
import { actionStore } from '@/lib/action-store';
import { createCalendarEvent, sendEmail } from '@/lib/google-actions';

const AIRLOCK_SECRET = process.env.AIRLOCK_SECRET || 'demo-secret-123';

interface IntentRequest {
  user_id: string;
  secret: string;
  intent: string;
  context?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  console.log('\n========== AIRLOCK INTENT API ==========');
  console.log('[Airlock] Received intent request');

  try {
    const body: IntentRequest = await request.json();
    console.log('[Airlock] Request body:', JSON.stringify(body, null, 2));

    // Step 1: Validate shared secret
    if (body.secret !== AIRLOCK_SECRET) {
      console.log('[Airlock] ❌ Invalid secret');
      return NextResponse.json(
        { error: 'Invalid airlock secret' },
        { status: 401 }
      );
    }
    console.log('[Airlock] ✅ Secret validated');

    const { user_id, intent, context = {} } = body;

    if (!user_id || !intent) {
      console.log('[Airlock] ❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing user_id or intent' },
        { status: 400 }
      );
    }

    // Step 2: Parse intent using LangChain + OpenAI
    console.log('[Airlock] 🧠 Parsing intent with AI...');
    const parsedAction = await parseIntent(intent, context);
    console.log('[Airlock] ✅ Parsed action:', JSON.stringify(parsedAction, null, 2));

    const requiredScopes = getRequiredScopes(parsedAction);
    console.log('[Airlock] Required scopes:', requiredScopes);

    // Step 3: Check if scopes are granted
    const hasScopes = actionStore.hasScopes(user_id, requiredScopes);
    console.log('[Airlock] Has required scopes:', hasScopes);

    if (!hasScopes && requiredScopes.length > 0) {
      // Add to pending consent queue
      const actionId = actionStore.addPendingAction({
        userId: user_id,
        action: parsedAction,
        intent,
        scopes: requiredScopes,
      });

      console.log('[Airlock] ⏳ Action awaiting consent:', actionId);
      console.log('[Airlock] User needs to approve at /dashboard');

      return NextResponse.json({
        status: 'awaiting_consent',
        action_id: actionId,
        action_type: parsedAction.type,
        action_description: getActionDescription(parsedAction),
        required_scopes: requiredScopes,
        consent_url: '/dashboard',
        message: 'This action requires your consent. Please approve it in your dashboard.',
      });
    }

    // Step 4: Execute the action
    console.log('[Airlock] 🚀 Executing action...');
    const result = await executeAction(parsedAction, user_id, intent);

    console.log('[Airlock] ✅ Action executed successfully');
    console.log('========== END AIRLOCK INTENT API ==========\n');

    return NextResponse.json({
      status: 'executed',
      action_type: parsedAction.type,
      action_description: getActionDescription(parsedAction),
      result,
      token_source: 'Token Vault',
    });
  } catch (error) {
    console.error('[Airlock] ❌ Error:', error);
    console.log('========== END AIRLOCK INTENT API (ERROR) ==========\n');

    return NextResponse.json(
      { error: 'Failed to process intent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
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
      console.log('[Airlock]', result);

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
