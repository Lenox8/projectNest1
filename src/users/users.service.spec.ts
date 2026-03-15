import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

const mockUserRepository = {
  create: jest.fn((dto) => ({ id: 'uuid', ...dto })),
  findOne: jest.fn((email) => null),
  findAll: jest.fn(() => []),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'UserRepository', useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { username: 'user', email: 'a@b.com', pass: '123' };
    const user = await service.create(dto);
    expect(user).toEqual(expect.objectContaining(dto));
  });
});
