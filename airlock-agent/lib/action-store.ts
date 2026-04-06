export interface PendingAction {
  id: string;
  userId: string;
  action: {
    type: 'CALENDAR_EVENT' | 'SEND_EMAIL' | 'CRM_UPDATE';
    [key: string]: unknown;
  };
  intent: string;
  scopes: string[];
  status: 'pending' | 'approved' | 'denied' | 'executed';
  createdAt: Date;
}

export interface ActionLogEntry {
  id: string;
  userId: string;
  intent: string;
  actionType: 'CALENDAR_EVENT' | 'SEND_EMAIL' | 'CRM_UPDATE';
  scope: string;
  status: 'success' | 'error' | 'mocked';
  result: string;
  timestamp: Date;
  tokenSource: 'Token Vault' | 'Mock';
}

class ActionStore {
  private pendingActions: Map<string, PendingAction> = new Map();
  private actionLog: ActionLogEntry[] = [];
  private userScopes: Map<string, Set<string>> = new Map();

  addPendingAction(action: Omit<PendingAction, 'id' | 'createdAt' | 'status'>): string {
    const id = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const pendingAction: PendingAction = {
      ...action,
      id,
      status: 'pending',
      createdAt: new Date(),
    };
    this.pendingActions.set(id, pendingAction);
    console.log(`[ActionStore] Added pending action ${id} for user ${action.userId}`);
    return id;
  }

  getPendingActions(userId: string): PendingAction[] {
    return Array.from(this.pendingActions.values())
      .filter((a) => a.userId === userId && a.status === 'pending')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getPendingAction(actionId: string): PendingAction | undefined {
    return this.pendingActions.get(actionId);
  }

  approveAction(actionId: string): PendingAction | undefined {
    const action = this.pendingActions.get(actionId);
    if (action) {
      action.status = 'approved';
      console.log(`[ActionStore] Approved action ${actionId}`);
    }
    return action;
  }

  denyAction(actionId: string): PendingAction | undefined {
    const action = this.pendingActions.get(actionId);
    if (action) {
      action.status = 'denied';
      console.log(`[ActionStore] Denied action ${actionId}`);
    }
    return action;
  }

  markExecuted(actionId: string): void {
    const action = this.pendingActions.get(actionId);
    if (action) {
      action.status = 'executed';
      console.log(`[ActionStore] Marked action ${actionId} as executed`);
    }
  }

  addActionLog(entry: Omit<ActionLogEntry, 'id' | 'timestamp'>): string {
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logEntry: ActionLogEntry = {
      ...entry,
      id,
      timestamp: new Date(),
    };
    this.actionLog.unshift(logEntry);
    if (this.actionLog.length > 100) {
      this.actionLog = this.actionLog.slice(0, 100);
    }
    console.log(`[ActionStore] Added action log: ${entry.actionType} - ${entry.status}`);
    return id;
  }

  getActionLog(userId: string, limit: number = 10): ActionLogEntry[] {
    return this.actionLog
      .filter((l) => l.userId === userId)
      .slice(0, limit);
  }

  grantScopes(userId: string, scopes: string[]): void {
    if (!this.userScopes.has(userId)) {
      this.userScopes.set(userId, new Set());
    }
    scopes.forEach((scope) => this.userScopes.get(userId)!.add(scope));
    console.log(`[ActionStore] Granted scopes to ${userId}: ${scopes.join(', ')}`);
  }

  hasScopes(userId: string, scopes: string[]): boolean {
    const userScopes = this.userScopes.get(userId);
    if (!userScopes) return false;
    return scopes.every((scope) => userScopes.has(scope));
  }

  getGrantedScopes(userId: string): string[] {
    return Array.from(this.userScopes.get(userId) || []);
  }
}

export const actionStore = new ActionStore();
