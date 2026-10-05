import jwt from 'jsonwebtoken';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import request from 'supertest';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';
import PostMessage from '../../backend/src/models/postMessageModel';
import DenunciaMessage from '../../backend/src/models/denunciaMessageModel';
import Post from '../../backend/src/models/postModel';
import ServicePost from '../../services/messages-service/src/models/postModel';
import postsRoutes from '../../services/messages-service/src/routes/postsRoutes';
import {uploadsDir} from '../../services/messages-service/src/uploads';

const secret = 'lgpd-test-secret';
jest.setTimeout(60_000);

describe('Exportação e exclusão de dados pessoais', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    process.env.JWT_SECRET = secret;
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await ServicePost.db.openUri(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await ServicePost.db.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    delete process.env.POSTS_SERVICE_URL;
    await Promise.all([
      User.deleteMany({}), PostMessage.deleteMany({}),
      DenunciaMessage.deleteMany({}), Post.deleteMany({}),
    ]);
    jest.restoreAllMocks();
  });

  async function createUser(email: string) {
    const user = await User.create({nome: email.split('@')[0], email, senha: 'segredo', tipo: 'cliente'});
    const token = jwt.sign({userId: user._id.toString(), email}, secret);
    return {user, token};
  }

  it('exporta somente dados vinculados por ID, sem senha ou dados de terceiros', async () => {
    const owner = await createUser('titular@email.com');
    const other = await createUser('outra@email.com');
    await User.updateOne({_id: owner.user._id}, {$set: {cpf: '40442820135'}});
    await PostMessage.create({userId: owner.user._id, email: owner.user.email, mensagem: 'meu comentário'});
    await DenunciaMessage.create({userId: owner.user._id, email: owner.user.email, descricao: 'minha denúncia'});
    await Post.create({userId: owner.user._id, titulo: 'Meu post'});
    await PostMessage.create({userId: other.user._id, email: other.user.email, mensagem: 'comentário alheio'});
    await PostMessage.create({email: owner.user.email, mensagem: 'legado sem autor comprovado'});

    const response = await request(app)
      .get(`/api/users/${owner.user._id}/data-export`)
      .set('Authorization', `Bearer ${owner.token}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-disposition']).toContain('attachment');
    expect(response.body.user).toMatchObject({email: owner.user.email, cpf: '40442820135'});
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.reports).toHaveLength(1);
    expect(response.body.posts).toHaveLength(1);
    expect(JSON.stringify(response.body)).not.toContain('segredo');
    expect(JSON.stringify(response.body)).not.toContain('comentário alheio');
    expect(JSON.stringify(response.body)).not.toContain('legado sem autor comprovado');
  });

  it('recusa exportação e exclusão sem autenticação ou para outra conta', async () => {
    const owner = await createUser('titular@email.com');
    const other = await createUser('outra@email.com');
    const path = `/api/users/${owner.user._id}`;

    expect((await request(app).get(`${path}/data-export`)).status).toBe(401);
    expect((await request(app).delete(path)).status).toBe(401);
    expect((await request(app).get(`${path}/data-export`).set('Authorization', `Bearer ${other.token}`)).status).toBe(403);
    expect((await request(app).delete(path).set('Authorization', `Bearer ${other.token}`)).status).toBe(403);
    expect(await User.findById(owner.user._id)).not.toBeNull();
  });

  it('exclui a conta e seus registros, preservando dados de outras pessoas', async () => {
    const owner = await createUser('titular@email.com');
    const other = await createUser('outra@email.com');
    const post = await Post.create({userId: owner.user._id, titulo: 'Meu conteúdo', descricao: 'texto pessoal'});
    await Post.collection.updateOne({_id: post._id}, {$set: {legacyContact: 'contato pessoal'}});
    const otherPost = await Post.create({userId: other.user._id, titulo: 'Post alheio'});
    await PostMessage.create({userId: owner.user._id, email: owner.user.email, mensagem: 'meu comentário'});
    await PostMessage.create({userId: other.user._id, email: other.user.email, mensagem: 'comentário de outra pessoa', postId: post._id.toString()});
    await PostMessage.create({email: owner.user.email, mensagem: 'legado sem vínculo'});
    await DenunciaMessage.create({userId: owner.user._id, email: owner.user.email, descricao: 'minha denúncia'});
    const thirdPartyReport = await DenunciaMessage.create({userId: other.user._id, email: other.user.email, descricao: 'denúncia sobre titular', alvoTipo: 'usuario', alvoId: owner.user._id.toString()});

    const response = await request(app)
      .delete(`/api/users/${owner.user._id}`)
      .set('Authorization', `Bearer ${owner.token}`);

    expect(response.status).toBe(200);
    expect(response.body.retainedRecords).toMatchObject([{
      type: 'anonymizedPostPlaceholders', count: 1, fields: ['_id', 'titulo'],
    }]);
    expect(response.body.manualReviewRequired).toHaveLength(2);
    expect(await User.findById(owner.user._id)).toBeNull();
    expect(await PostMessage.countDocuments({userId: owner.user._id})).toBe(0);
    expect(await DenunciaMessage.countDocuments({userId: owner.user._id})).toBe(0);
    expect(await Post.findById(post._id)).toMatchObject({titulo: 'Publicação removida'});
    expect((await Post.findById(post._id))?.userId).toBeUndefined();
    expect((await Post.findById(post._id))?.descricao).toBeUndefined();
    expect((await Post.findById(post._id))?.createdAt).toBeUndefined();
    expect(await Post.collection.findOne({_id: post._id})).toEqual({
      _id: post._id,
      titulo: 'Publicação removida',
    });
    expect(await Post.findById(otherPost._id)).not.toBeNull();
    expect(await PostMessage.countDocuments({userId: other.user._id})).toBe(1);
    expect(await PostMessage.countDocuments({userId: {$exists: false}})).toBe(1);
    expect((await DenunciaMessage.findById(thirdPartyReport._id))?.alvoId).toBeUndefined();
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${owner.token}`)).status).toBe(401);
  });

  it('permite retomar a exclusão se a limpeza de mídia estiver indisponível', async () => {
    const owner = await createUser('titular@email.com');
    await Post.create({userId: owner.user._id, titulo: 'Post com imagem', imageUrl: '/uploads/teste.png'});
    const path = `/api/users/${owner.user._id}`;

    const first = await request(app).delete(path).set('Authorization', `Bearer ${owner.token}`);
    expect(first.status).toBe(503);
    expect((await User.findById(owner.user._id).select('+deletionRequestedAt'))?.deletionRequestedAt).toBeDefined();
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${owner.token}`)).status).toBe(401);

    process.env.POSTS_SERVICE_URL = 'http://posts.local';
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ok: true} as Response);
    const retry = await request(app).delete(path).set('Authorization', `Bearer ${owner.token}`);
    expect(retry.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await User.findById(owner.user._id)).toBeNull();
  });

  it('remove arquivos de posts do titular no serviço de mídia', async () => {
    const owner = await createUser('titular@email.com');
    const filename = `lgpd-${new mongoose.Types.ObjectId()}.png`;
    const filePath = path.join(uploadsDir, filename);
    const mediaApp = express();
    mediaApp.use('/api/posts', postsRoutes as unknown as express.Router);
    await fs.writeFile(filePath, 'imagem de teste');
    try {
      await ServicePost.create({userId: owner.user._id, titulo: 'Post com imagem', imageUrl: `/uploads/${filename}`});
      const response = await request(mediaApp)
        .delete('/api/posts/me/media')
        .set('Authorization', `Bearer ${owner.token}`);
      expect(response.status).toBe(200);
      expect(response.body.removed).toBe(1);
      await expect(fs.stat(filePath)).rejects.toMatchObject({code: 'ENOENT'});
    } finally {
      await fs.rm(filePath, {force: true});
    }
  });

  it('exclui a conta pelo fluxo /auth/me e remove a imagem pelo serviço de posts', async () => {
    const owner = await createUser('titular@email.com');
    const filename = `lgpd-${new mongoose.Types.ObjectId()}.png`;
    const filePath = path.join(uploadsDir, filename);
    const mediaApp = express();
    mediaApp.use('/api/posts', postsRoutes as unknown as express.Router);
    const mediaServer = mediaApp.listen(0);
    await fs.writeFile(filePath, 'imagem de teste');

    try {
      const address = mediaServer.address();
      if (!address || typeof address === 'string') throw new Error('Porta indisponível');
      process.env.POSTS_SERVICE_URL = `http://127.0.0.1:${address.port}`;

      const post = await Post.create({
        userId: owner.user._id,
        titulo: 'Meu post com imagem',
        imageUrl: `/uploads/${filename}`,
      });
      await PostMessage.create({userId: owner.user._id, email: owner.user.email, mensagem: 'Meu comentário'});

      const response = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${owner.token}`);

      expect(response.status).toBe(200);
      expect(await User.findById(owner.user._id)).toBeNull();
      expect(await PostMessage.countDocuments({userId: owner.user._id})).toBe(0);
      expect((await Post.findById(post._id))?.imageUrl).toBeUndefined();
      await expect(fs.stat(filePath)).rejects.toMatchObject({code: 'ENOENT'});
    } finally {
      await new Promise<void>((resolve, reject) => {
        mediaServer.close(error => error ? reject(error) : resolve());
      });
      await fs.rm(filePath, {force: true});
    }
  });
});
