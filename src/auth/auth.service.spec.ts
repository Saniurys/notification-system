import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from './encryption.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: { sign: () => 'token_de_prueba' } },
        { provide: EncryptionService, useValue: { compare: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if user not found', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);
    // login() es el método que realmente existe en tu AuthService
    await expect(service.login({ email: 'test@test.com', password: 'pass' }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('should return access_token if credentials are valid', async () => {
    mockUserService.findByEmail.mockResolvedValue({
      id: 1,
      username: 'testuser',
      email: 'test@test.com',
      password: 'hashedpass',
    });
    const mockEncryption = { compare: jest.fn().mockResolvedValue(true) };
    
    const localModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: { sign: () => 'token_de_prueba' } },
        { provide: EncryptionService, useValue: mockEncryption },
      ],
    }).compile();

    const localService = localModule.get<AuthService>(AuthService);
    const result = await localService.login({ email: 'test@test.com', password: 'pass' });
    expect(result.access_token).toBe('token_de_prueba');
  });
});