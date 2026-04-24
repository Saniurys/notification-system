import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { NotificationDispatcher } from './notification.dispatcher';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockDispatcher = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: getRepositoryToken(Notification), useValue: mockNotificationRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: NotificationDispatcher, useValue: mockDispatcher },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});