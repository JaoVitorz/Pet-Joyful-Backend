import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  event: {type: String, required: true, maxlength: 100, index: true},
  actorId: {type: String, default: null},
  actorRole: {type: String, default: 'system'},
  subjectId: {type: String, default: null},
  createdAt: {type: Date, default: Date.now, expires: 60 * 60 * 24 * 365},
}, {versionKey: false, strict: 'throw'});

export default mongoose.models.AuditLog ?? mongoose.model('AuditLog', auditLogSchema);
