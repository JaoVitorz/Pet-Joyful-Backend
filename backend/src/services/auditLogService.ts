import AuditLog from '../models/auditLogModel.js';
import {logger} from '../logger/logger.js';

export async function recordAuditEvent(event: string, actorId?: string, subjectId?: string, actorRole = 'system'): Promise<void> {
  try {
    await AuditLog.create({event, actorId: actorId ?? null, subjectId: subjectId ?? null, actorRole});
  } catch {
    // Audit logs never contain request bodies, tokens, passwords, or raw PII.
    logger.error('Falha ao persistir evento de auditoria');
  }
}
