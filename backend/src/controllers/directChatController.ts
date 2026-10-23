import mongoose from 'mongoose';
import type {Response} from 'express';
import type {AuthRequest} from '../types/index.js';
import User from '../models/userModel.js';
import DirectConversation from '../models/directConversationModel.js';
import DirectMessage from '../models/directMessageModel.js';

const MAX_MESSAGE_LENGTH = 2000;
const MAX_PAGE_SIZE = 100;

function participantKey(firstId: string, secondId: string): string {
  return [firstId, secondId].sort().join(':');
}

function isParticipant(conversation: {participants: mongoose.Types.ObjectId[]}, userId: string): boolean {
  return conversation.participants.some(participant => String(participant) === userId);
}

export async function listChatUsers(req: AuthRequest, res: Response): Promise<Response> {
  const currentUserId = req.userId;
  if (!currentUserId) return res.status(401).json({error: 'Usuário não autenticado'});

  const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const filter: Record<string, unknown> = {
    _id: {$ne: currentUserId},
    deletionRequestedAt: {$exists: false},
  };
  if (query) {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.nome = {$regex: safeQuery, $options: 'i'};
  }

  const users = await User.find(filter).select('nome tipo').sort({nome: 1}).limit(30).lean();
  return res.json({success: true, users: users.map(user => ({
    id: String(user._id),
    name: user.nome,
    nome: user.nome,
    tipo: user.tipo,
  }))});
}

export async function listConversations(req: AuthRequest, res: Response): Promise<Response> {
  const currentUserId = req.userId;
  if (!currentUserId) return res.status(401).json({error: 'Usuário não autenticado'});

  const conversations = await DirectConversation.find({participants: currentUserId})
    .sort({lastMessageAt: -1, updatedAt: -1})
    .populate({path: 'participants', select: 'nome tipo deletionRequestedAt'})
    .lean();

  return res.json({success: true, conversations: conversations.map(conversation => {
    const participants = (conversation.participants as unknown as Array<{
      _id: mongoose.Types.ObjectId; nome: string; tipo: string;
    }>);
    const otherUser = participants.find(user => String(user._id) !== currentUserId);
    return {
      id: String(conversation._id),
      user: otherUser ? {id: String(otherUser._id), name: otherUser.nome, nome: otherUser.nome, tipo: otherUser.tipo} : null,
      lastMessage: conversation.lastMessage ?? '',
      lastMessageAt: conversation.lastMessageAt ?? null,
      updatedAt: conversation.updatedAt,
    };
  }).filter(conversation => conversation.user !== null)});
}

export async function createConversation(req: AuthRequest, res: Response): Promise<Response> {
  const currentUserId = req.userId;
  const body = req.body as {userId?: unknown};
  const targetUserId = typeof body.userId === 'string' ? body.userId : '';
  if (!currentUserId) return res.status(401).json({error: 'Usuário não autenticado'});
  if (!mongoose.isValidObjectId(targetUserId)) return res.status(400).json({error: 'ID do usuário inválido'});
  if (targetUserId === currentUserId) return res.status(400).json({error: 'Não é possível iniciar uma conversa consigo mesmo'});

  const otherUser = await User.findOne({_id: targetUserId, deletionRequestedAt: {$exists: false}})
    .select('nome tipo').lean();
  if (!otherUser) return res.status(404).json({error: 'Usuário não encontrado'});

  const key = participantKey(currentUserId, targetUserId);
  let conversation = await DirectConversation.findOne({participantKey: key});
  if (!conversation) {
    try {
      conversation = await DirectConversation.create({
        participants: [currentUserId, targetUserId].sort().map(id => new mongoose.Types.ObjectId(id)),
        participantKey: key,
      });
    } catch (error) {
      // Duas solicitações simultâneas podem tentar criar o mesmo par.
      if (!(error instanceof mongoose.mongo.MongoServerError) || error.code !== 11000) throw error;
      conversation = await DirectConversation.findOne({participantKey: key});
      if (!conversation) throw error;
    }
  }

  return res.status(200).json({success: true, conversation: {
    id: String(conversation._id),
    user: {id: String(otherUser._id), name: otherUser.nome, nome: otherUser.nome, tipo: otherUser.tipo},
    lastMessage: conversation.lastMessage ?? '',
    lastMessageAt: conversation.lastMessageAt ?? null,
  }});
}

export async function listConversationMessages(req: AuthRequest, res: Response): Promise<Response> {
  const currentUserId = req.userId;
  const conversationId = req.params.id;
  if (!currentUserId) return res.status(401).json({error: 'Usuário não autenticado'});
  if (!mongoose.isValidObjectId(conversationId)) return res.status(400).json({error: 'ID da conversa inválido'});

  const conversation = await DirectConversation.findById(conversationId).select('participants').lean();
  if (!conversation) return res.status(404).json({error: 'Conversa não encontrada'});
  if (!isParticipant(conversation, currentUserId)) return res.status(403).json({error: 'Você não participa desta conversa'});

  const requestedLimit = Number(req.query.limit);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, MAX_PAGE_SIZE)
    : MAX_PAGE_SIZE;
  const messages = await DirectMessage.find({conversationId})
    .sort({createdAt: -1, _id: -1})
    .limit(limit)
    .lean();

  return res.json({success: true, messages: messages.reverse().map(message => ({
    id: String(message._id),
    senderId: String(message.senderId),
    text: message.text,
    createdAt: message.createdAt,
  }))});
}

export async function sendConversationMessage(req: AuthRequest, res: Response): Promise<Response> {
  const currentUserId = req.userId;
  const conversationId = req.params.id;
  const body = req.body as {text?: unknown};
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!currentUserId) return res.status(401).json({error: 'Usuário não autenticado'});
  if (!mongoose.isValidObjectId(conversationId)) return res.status(400).json({error: 'ID da conversa inválido'});
  if (!text) return res.status(400).json({error: 'A mensagem não pode estar vazia'});
  if (text.length > MAX_MESSAGE_LENGTH) return res.status(400).json({error: `A mensagem deve ter no máximo ${MAX_MESSAGE_LENGTH} caracteres`});

  const conversation = await DirectConversation.findById(conversationId).select('participants');
  if (!conversation) return res.status(404).json({error: 'Conversa não encontrada'});
  if (!isParticipant(conversation, currentUserId)) return res.status(403).json({error: 'Você não participa desta conversa'});

  const now = new Date();
  const [message] = await Promise.all([
    DirectMessage.create({conversationId, senderId: currentUserId, text}),
    DirectConversation.updateOne({_id: conversationId}, {$set: {lastMessage: text, lastMessageAt: now}}),
  ]);

  return res.status(201).json({success: true, message: {
    id: String(message._id),
    senderId: currentUserId,
    text: message.text,
    createdAt: message.createdAt,
  }});
}
