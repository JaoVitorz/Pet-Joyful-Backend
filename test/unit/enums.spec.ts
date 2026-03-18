// Importa os enums que serão testados
import { UserTipo, AlvoTipo } from '../../backend/src/types/index';

// describe: agrupa os testes relacionados ao enum UserTipo
describe('UserTipo', () => {

  it('should have ADOTANTE with value "adotante"', () => {
    // Arrange: pega o valor do enum
    const tipo = UserTipo.ADOTANTE;

    // Assert: verifica se o valor é o esperado
    expect(tipo).toEqual('adotante');
  });

  it('should have CLIENTE with value "cliente"', () => {
    // Arrange
    const tipo = UserTipo.CLIENTE;

    // Assert
    expect(tipo).toEqual('cliente');
  });

  it('should have ADMIN with value "admin"', () => {
    // Arrange
    const tipo = UserTipo.ADMIN;

    // Assert
    expect(tipo).toEqual('admin');
  });

});

// describe: agrupa os testes relacionados ao enum AlvoTipo
describe('AlvoTipo', () => {

  it('should have POST with value "post"', () => {
    // Arrange
    const alvo = AlvoTipo.POST;

    // Assert
    expect(alvo).toEqual('post');
  });

  it('should have USUARIO with value "usuario"', () => {
    // Arrange
    const alvo = AlvoTipo.USUARIO;

    // Assert
    expect(alvo).toEqual('usuario');
  });

  it('should have OUTRO with value "outro"', () => {
    // Arrange
    const alvo = AlvoTipo.OUTRO;

    // Assert
    expect(alvo).toEqual('outro');
  });

});