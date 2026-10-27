import mongoose from 'mongoose';
import Post from '../../services/messages-service/src/models/postModel';
import {createPost} from '../../services/messages-service/src/controllers/postsController';
import type {AuthenticatedRequest} from '../../services/messages-service/src/middlewares/requireUser';

describe('Autoria persistida nos posts', () => {
  afterEach(() => jest.restoreAllMocks());

  it('recusa um userId enviado pelo cliente antes de salvar', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const spoofedId = new mongoose.Types.ObjectId().toString();
    const save = jest.spyOn(Post.prototype, 'save').mockImplementation(async function (this: InstanceType<typeof Post>) { return this; });
    const req = {userId, body: {titulo: 'Meu post', userId: spoofedId}} as AuthenticatedRequest;
    const res = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis()} as unknown as Parameters<typeof createPost>[1];

    await createPost(req, res);

    expect(save).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('usa o usuário autenticado no post válido', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const save = jest.spyOn(Post.prototype, 'save').mockImplementation(async function (this: InstanceType<typeof Post>) { return this; });
    const req = {userId, body: {titulo: 'Meu post', descricao: 'Texto'}} as AuthenticatedRequest;
    const res = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis()} as unknown as Parameters<typeof createPost>[1];

    await createPost(req, res);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.instances[0].userId?.toString()).toBe(userId);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
