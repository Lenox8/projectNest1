import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guard/jwt-auth/auth.guard';
import { RolesGuard } from '../auth/guard/roles/roles.guard';
import { NotFoundException } from '@nestjs/common';
import type { User } from './user.model';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  const mockUsersService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should return a user when findOne is called with an existing id', async () => {
    const expectedUser = {
      id: '1',
      email: 'user@example.com',
      name: 'Test User',
      username: 'testuser',
      pass: 'pass',
      birthYear: '2000-04-08',
      role: 'admin',
    } as unknown as User;

    jest.spyOn(userService, 'findOne').mockResolvedValue(expectedUser);

    const result = await controller.findOne('1');
    expect(result).toEqual(expectedUser);
  });

  it('should throw NotFoundException when findOne has no result', async () => {
    jest.spyOn(userService, 'findOne').mockResolvedValue(null);
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });
});
