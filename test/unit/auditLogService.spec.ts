import AuditLog from '../../backend/src/models/auditLogModel';
import {recordAuditEvent} from '../../backend/src/services/auditLogService';
import {logger} from '../../backend/src/logger/logger';

describe('auditoria de segurança', () => {
  afterEach(() => jest.restoreAllMocks());

  it('persiste apenas o evento, identidades e papel, com expiração definida', async () => {
    const create = jest.spyOn(AuditLog, 'create').mockResolvedValue({} as never);
    await recordAuditEvent('user.updated', 'actor-id', 'subject-id', 'admin');
    expect(create).toHaveBeenCalledWith({event: 'user.updated', actorId: 'actor-id', subjectId: 'subject-id', actorRole: 'admin'});
    const ttl = AuditLog.schema.indexes().find(([, options]) => options?.expireAfterSeconds);
    expect(ttl?.[1].expireAfterSeconds).toBe(31_536_000);
  });

  it('não derruba a operação nem registra detalhes ao falhar a gravação', async () => {
    const create = jest.spyOn(AuditLog, 'create').mockRejectedValue(new Error('database credentials leaked'));
    const log = jest.spyOn(logger, 'error').mockImplementation(() => undefined as never);
    await expect(recordAuditEvent('user.deleted')).resolves.toBeUndefined();
    expect(create).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith('Falha ao persistir evento de auditoria');
  });
});
