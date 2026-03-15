import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn((dto: SigninDto) => {
      if (dto.email === 'user' && dto.pass === 'pass') {
        return { access_token: 'fake-jwt-token' };
      }
      throw new Error('Invalid credentials');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWT token on successful signIn', async () => {
    const dto: SigninDto = { email: 'user', pass: 'pass' };
    const result = await controller.signIn(dto);
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
    expect(authService.signIn).toHaveBeenCalledWith(dto);
  });

  it('should throw error on invalid credentials', async () => {
    const dto: SigninDto = { email: 'wrong', pass: 'wrong' };
    await expect(controller.signIn(dto)).rejects.toThrow('Invalid credentials');
  });
});
