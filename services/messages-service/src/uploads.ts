import path from 'node:path';

export const uploadsDir = path.resolve(process.env.POSTS_UPLOAD_DIR ?? 'uploads');
