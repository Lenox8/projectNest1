import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

const mockUserRepository = {
  create: jest.fn((dto: Partial<User>) => ({ id: 'uuid', ...dto }) as User),
  findOne: jest.fn(() => null),
  findAll: jest.fn(() => []),
  destroy: jest.fn(() => 1),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: 'user', email: 'a@b.com', pass: '123' };
    const user = await service.create(dto as CreateUserDto);
    expect(user).toEqual(expect.objectContaining(dto));
  });
});
