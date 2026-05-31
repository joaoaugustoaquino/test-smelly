const { UserService } = require('../src/userService');

describe('UserService - Clean Tests', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('deve criar um usuário válido', () => {
    // Arrange
    const nome = 'Fulano';
    const email = 'fulano@teste.com';
    const idade = 25;

    // Act
    const usuario = userService.createUser(nome, email, idade);

    // Assert
    expect(usuario.id).toBeDefined();
    expect(usuario.nome).toBe(nome);
    expect(usuario.status).toBe('ativo');
  });

  test('deve buscar usuário pelo id', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      'Fulano',
      'fulano@teste.com',
      25
    );

    // Act
    const usuarioBuscado =
      userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  test('deve desativar usuário comum', () => {
    // Arrange
    const usuario =
      userService.createUser(
        'Comum',
        'comum@teste.com',
        30
      );

    // Act
    const resultado =
      userService.deactivateUser(usuario.id);

    // Assert
    expect(resultado).toBe(true);
    expect(
      userService.getUserById(usuario.id).status
    ).toBe('inativo');
  });

  test('não deve desativar administrador', () => {
    // Arrange
    const admin =
      userService.createUser(
        'Admin',
        'admin@teste.com',
        40,
        true
      );

    // Act
    const resultado =
      userService.deactivateUser(admin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(
      userService.getUserById(admin.id).status
    ).toBe('ativo');
  });

  test('deve gerar relatório contendo usuários cadastrados', () => {
    // Arrange
    userService.createUser(
      'Alice',
      'alice@email.com',
      28
    );

    // Act
    const relatorio =
      userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');
  });

  test('deve impedir criação de usuário menor de idade', () => {
    expect(() => {
      userService.createUser(
        'Menor',
        'menor@email.com',
        17
      );
    }).toThrow(
      'O usuário deve ser maior de idade.'
    );
  });

  test('deve retornar relatório vazio quando não houver usuários', () => {
    const relatorio =
      userService.generateUserReport();

    expect(relatorio).toContain(
      'Nenhum usuário cadastrado.'
    );
  });
});