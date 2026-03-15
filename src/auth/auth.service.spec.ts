import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn((email) => {
      if (email === 'user@test.com') {
        return { id: '1', email, pass: '123' };
      }
      return null;
    }),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'fake-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a token', async () => {
    const dto: SigninDto = { email: 'user@test.com', pass: '123' };
    const result = await service.signIn(dto);
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(mockUsersService.findByEmail).toHaveBeenCalledWith('user@test.com');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      id: '1',
      email: 'user@test.com',
    });
  });

  it('should throw UnauthorizedException for invalid email', async () => {
    const dto: SigninDto = { email: 'wrong@test.com', pass: '123' };
    await expect(service.signIn(dto)).rejects.toThrow(UnauthorizedException);
  });
});
