import mongoose from 'mongoose';
import Post from '../../services/messages-service/src/models/postModel';
import {createPost} from '../../services/messages-service/src/controllers/postsController';
import type {AuthenticatedRequest} from '../../services/messages-service/src/middlewares/requireUser';

describe('Autoria persistida nos posts', () => {
  afterEach(() => jest.restoreAllMocks());

  it('usa o usuário autenticado e ignora um userId enviado no corpo', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const spoofedId = new mongoose.Types.ObjectId().toString();
    const save = jest.spyOn(Post.prototype, 'save').mockImplementation(async function (this: InstanceType<typeof Post>) { return this; });
    const req = {userId, body: {titulo: 'Meu post', userId: spoofedId}} as AuthenticatedRequest;
    const res = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis()} as unknown as Parameters<typeof createPost>[1];

    await createPost(req, res);

    expect(save).toHaveBeenCalledTimes(1);
    const savedPost = save.mock.instances[0];
    expect(savedPost.userId?.toString()).toBe(userId);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
