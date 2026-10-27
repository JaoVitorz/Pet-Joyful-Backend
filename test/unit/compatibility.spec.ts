import express from 'express';
import request from 'supertest';
import {checkCompatibility} from '../../backend/src/controllers/compatibilityController';
import {parseCompatibilityResult, validateProfiles} from '../../backend/src/services/compatibilityService';

const generateContent = jest.fn();
jest.mock('@google/genai', () => ({GoogleGenAI: jest.fn().mockImplementation(() => ({models: {generateContent}}))}));

const profiles = {adopter: {livingSpace: 'apartamento', experience: 'moderada', timeAvailable: '2 horas'}, pet: {type: 'gato', breed: 'SRD'}};
const result = {score: 80, assessment: 'Rotinas compatíveis.', alerts: [], tips: ['Planeje a adaptação.']};
const app = express();
app.use(express.json());
app.post('/api/compatibilidade', checkCompatibility);
const originalKey = process.env.GEMINI_API_KEY;
beforeEach(() => { process.env.GEMINI_API_KEY = 'test-key'; generateContent.mockReset(); });
afterAll(() => { if (originalKey === undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY = originalKey; });

it('normaliza perfis e descarta campos extras', () => {
  expect(validateProfiles({...profiles, adopter: {...profiles.adopter, livingSpace: ' casa ', secret: 'ignored'}}).adopter).toEqual({livingSpace: 'casa', experience: 'moderada', timeAvailable: '2 horas', familyComposition: '', lifestyle: ''});
});
it.each([null, {}, {...profiles, pet: []}, {...profiles, adopter: {...profiles.adopter, experience: ' '}}, {...profiles, pet: {...profiles.pet, breed: 42}}, {...profiles, pet: {...profiles.pet, description: 'a'.repeat(1001)}}])('rejeita entrada inválida %#', async body => {
  expect((await request(app).post('/api/compatibilidade').send(body as unknown as Record<string, unknown>)).status).toBe(400);
  expect(generateContent).not.toHaveBeenCalled();
});
it.each(['invalid', '{}', JSON.stringify({...result, score: 101}), JSON.stringify({...result, score: -1}), JSON.stringify({...result, score: '80'}), JSON.stringify({...result, alerts: null}), JSON.stringify({...result, tips: [42]})])('rejeita saída inválida %#', text => {
  expect(() => parseCompatibilityResult(text)).toThrow('resposta inválida');
});
it.each([0, 100])('aceita pontuação limite %s', score => {
  expect(parseCompatibilityResult(JSON.stringify({...result, score})).score).toBe(score);
});
it('retorna resultado estruturado com instruções próprias e timeout', async () => {
  generateContent.mockResolvedValue({text: JSON.stringify(result)});
  const response = await request(app).post('/api/compatibilidade').send(profiles);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({success: true, result});
  expect(generateContent).toHaveBeenCalledWith(expect.objectContaining({contents: expect.any(String), config: expect.objectContaining({responseMimeType: 'application/json', responseJsonSchema: expect.any(Object), abortSignal: expect.any(AbortSignal)})}));
});
it('retorna 503 sem chave e não chama Gemini', async () => {
  delete process.env.GEMINI_API_KEY;
  expect((await request(app).post('/api/compatibilidade').send(profiles)).status).toBe(503);
  expect(generateContent).not.toHaveBeenCalled();
});
it.each([[429, {status: 429}], [504, {name: 'TimeoutError'}], [504, {name: 'AbortError'}], [503, {status: 403, message: 'secret'}], [503, new Error('secret')]])('trata falha externa como %s', async (status, error) => {
  generateContent.mockRejectedValue(error);
  const response = await request(app).post('/api/compatibilidade').send(profiles);
  expect(response.status).toBe(status);
  expect(response.body.success).toBe(false);
  expect(JSON.stringify(response.body)).not.toContain('secret');
});
it('retorna 502 para resposta inválida do provedor', async () => {
  generateContent.mockResolvedValue({text: 'not json'});
  expect((await request(app).post('/api/compatibilidade').send(profiles)).status).toBe(502);
});
