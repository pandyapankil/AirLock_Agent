import { NextRequest, NextResponse } from 'next/server';
import { actionStore } from '@/lib/action-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const logs = actionStore.getActionLog(userId, limit);
  return NextResponse.json({ logs });
}
