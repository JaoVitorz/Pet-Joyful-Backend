import PostMessage from '../models/postMessageModel.js';
import DenunciaMessage from '../models/denunciaMessageModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

export class MediaCleanupError extends Error {}

export async function buildUserExport(userId: string) {
  const user = await User.findById(userId).select('-senha +cpf +deletionRequestedAt').lean();
  if (!user || user.deletionRequestedAt) return null;

  const [comments, reports, posts] = await Promise.all([
    PostMessage.find({userId}).sort({createdAt: 1}).lean(),
    DenunciaMessage.find({userId}).sort({createdAt: 1}).lean(),
    Post.find({userId}).sort({createdAt: 1}).lean(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: String(user._id),
      nome: user.nome,
      email: user.email,
      cpf: user.cpf ?? null,
      tipo: user.tipo,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    comments: comments.map(comment => ({
      id: String(comment._id),
      nome: comment.nome,
      email: comment.email,
      mensagem: comment.mensagem,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    })),
    reports: reports.map(report => ({
      id: String(report._id),
      nome: report.nome,
      email: report.email,
      descricao: report.descricao,
      alvoTipo: report.alvoTipo,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    })),
    posts: posts.map(post => ({
      id: String(post._id),
      titulo: post.titulo,
      descricao: post.descricao,
      imageUrl: post.imageUrl,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })),
  };
}

async function removePostMedia(userId: string, bearerToken: string): Promise<void> {
  const hasMedia = await Post.exists({userId, imageUrl: {$exists: true, $nin: [null, '']}});
  if (!hasMedia) return;

  const serviceUrl = process.env.POSTS_SERVICE_URL;
  if (!serviceUrl) {
    throw new MediaCleanupError('POSTS_SERVICE_URL não configurada para remover imagens dos posts');
  }

  try {
    const response = await fetch(new URL('/api/posts/me/media', serviceUrl), {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${bearerToken}`},
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch {
    throw new MediaCleanupError('Não foi possível remover as imagens dos posts');
  }
}

export async function eraseUserData(userId: string, bearerToken: string) {
  const user = await User.findById(userId).select('+deletionRequestedAt');
  if (!user) return null;

  if (!user.deletionRequestedAt) {
    await User.updateOne(
      {_id: userId, deletionRequestedAt: {$exists: false}},
      {$set: {deletionRequestedAt: new Date()}},
    );
  }

  await removePostMedia(userId, bearerToken);

  const comments = await PostMessage.deleteMany({userId});
  const reports = await DenunciaMessage.deleteMany({userId});
  let anonymizedPosts = 0;
  while (true) {
    const postIds = await Post.find({userId: user._id}).select('_id').limit(500).lean();
    if (postIds.length === 0) break;
    const result = await Post.collection.bulkWrite(postIds.map(post => ({
      replaceOne: {
        filter: {_id: post._id, userId: user._id},
        replacement: {_id: post._id, titulo: 'Publicação removida'},
      },
    })));
    anonymizedPosts += result.modifiedCount;
    if (result.matchedCount === 0) break;
  }
  const targetReports = await DenunciaMessage.updateMany(
    {alvoTipo: 'usuario', alvoId: userId},
    {$set: {descricao: 'Referência a conta excluída'}, $unset: {alvoId: ''}},
  );

  await User.findByIdAndDelete(userId);
  return {
    deleted: {comments: comments.deletedCount, reports: reports.deletedCount, account: true},
    anonymized: {posts: anonymizedPosts, reportsAboutAccount: targetReports.modifiedCount},
    retainedRecords: [{
      type: 'anonymizedPostPlaceholders',
      count: anonymizedPosts,
      fields: ['_id', 'titulo'],
      reason: 'Preservar comentários publicados por outras pessoas',
    }],
    manualReviewRequired: [
      'Registros antigos sem userId exigem comprovação de autoria antes do tratamento.',
      'Backups e logs anteriores dependem da política de retenção da infraestrutura.',
    ],
  };
}
