import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SigninDto } from './dto/signin.dto';

describe('AuthService', () => {
  let service: AuthService;
  const mockUsersService = { findByEmail: jest.fn() };
  const mockJwtService = { signAsync: jest.fn(() => 'fake-jwt-token') };

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

  it('should return a token', async () => {
    const hashedPass = await bcrypt.hash('pass', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      pass: hashedPass,
      role: 'admin',
    });

    const result = await service.signIn({
      email: 'user@example.com',
      pass: 'pass',
    } as SigninDto);

    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });

  it('should throw UnauthorizedException on invalid password', async () => {
    const hashedPass = await bcrypt.hash('pass', 10);
    mockUsersService.findByEmail.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      pass: hashedPass,
      role: 'admin',
    });

    await expect(
      service.signIn({ email: 'user@example.com', pass: 'wrong' } as SigninDto),
    ).rejects.toThrow(UnauthorizedException);
  });
});
