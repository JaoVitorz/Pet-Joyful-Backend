import {checkCpf, normalizeBirthDate, normalizeCpf} from '../../backend/src/services/cpfService';

describe('Validação de CPF', () => {
  it('confere dígitos e normaliza máscara e data', () => {
    expect(normalizeCpf('404.428.201-35')).toBe('40442820135');
    expect(normalizeCpf('111.111.111-11')).toBeNull();
    expect(normalizeCpf('404.428.201-36')).toBeNull();
    expect(normalizeBirthDate('14/11/1970')).toBe('14111970');
    expect(normalizeBirthDate('31/02/2000')).toBeNull();
  });

  it('consulta o Serpro v3 e interpreta situação regular e CPF inexistente', async () => {
    process.env.SERPRO_CONSUMER_KEY = 'test-key';
    process.env.SERPRO_CONSUMER_SECRET = 'test-secret';
    const fetchMock = jest.spyOn(global, 'fetch')
      .mockResolvedValueOnce({ok: true, json: async () => ({access_token: 'test-token', expires_in: 3600})} as Response)
      .mockResolvedValueOnce({status: 200, json: async () => ({ni: '40442820135', nascimento: '14111970', situacao: {codigo: '0'}})} as Response)
      .mockResolvedValueOnce({status: 404} as Response);

    expect(await checkCpf('40442820135', '14111970')).toEqual({status: 'regular'});
    expect(fetchMock.mock.calls[1][0]).toBe('https://gateway.apiserpro.serpro.gov.br/consulta-cpf-df/v3/cpf/40442820135/14111970');
    expect(await checkCpf('40442820135', '14111970')).toEqual({status: 'not_found'});
    expect(fetchMock).toHaveBeenCalledTimes(3);
    delete process.env.SERPRO_CONSUMER_KEY;
    delete process.env.SERPRO_CONSUMER_SECRET;
  });
});
