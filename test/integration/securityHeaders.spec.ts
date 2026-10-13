import request from 'supertest';
import app from '../../backend/src/app';

describe('Cabeçalhos de segurança HTTP', () => {
  it.each([
    ['rota base', () => request(app).get('/')],
    ['resposta de erro', () => request(app).get('/api/protected')],
    [
      'JSON inválido',
      () => request(app).post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{'),
    ],
    ['rota inexistente', () => request(app).get('/nao-existe')],
    ['documentação Swagger', () => request(app).get('/api-docs/')],
    [
      'preflight CORS',
      () => request(app).options('/api/protected')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET'),
    ],
  ])('inclui os cabeçalhos em %s', async (_cenario, enviar) => {
    const response = await enviar();

    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['content-security-policy']).toBeDefined();
    if (response.status === 404) {
      // O handler padrão do Express aplica uma política ainda mais restritiva.
      expect(response.headers['content-security-policy']).toBe("default-src 'none'");
    } else {
      expect(response.headers['content-security-policy']).toContain("default-src 'self'");
      expect(response.headers['content-security-policy']).toContain("frame-ancestors 'self'");
    }
  });
});
