import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/jwt-auth/auth.guard';
import { RolesGuard } from './guard/roles/roles.guard';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signIn: jest.fn((dto: SigninDto) => {
      if (dto.email === 'user' && dto.pass === 'pass')
        return { access_token: 'fake-jwt-token' };
      throw new Error('Invalid credentials');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWT token on successful signIn', async () => {
    const dto: SigninDto = { email: 'user', pass: 'pass' };
    expect(await controller.signIn(dto)).toEqual({
      access_token: 'fake-jwt-token',
    });
  });

  it('should throw error on invalid credentials', async () => {
    await expect(
      controller.signIn({ email: 'wrong', pass: 'wrong' }),
    ).rejects.toThrow('Invalid credentials');
  });
});
