import 'reflect-metadata';
import { UserService } from '../../src/services/users.service';
import { UserRepository } from '../../src/repositories/users.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { Document } from 'mongoose';
import { IUser } from '../../src/models/users.model';

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockProxy<UserRepository>;

  beforeEach(() => {
    userRepository = mock<UserRepository>();
    service = new UserService(userRepository);
  });

  it('should register a new user', async () => {
    const user: IUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    } as IUser;

    const userDocumentMock = {
      ...user,
      _id: 'user-id',
    } as unknown as Partial<Document> & IUser;

    userRepository.create.mockResolvedValueOnce(userDocumentMock);
    const result = await service.register(user);

    expect(result).toEqual({ ...user, _id: 'user-id' });
    expect(userRepository.create).toHaveBeenCalledWith(user);
  });

  it('should login a user with valid credentials', async () => {
    const token = 'mockToken';
    userRepository.login.mockResolvedValueOnce(token);
    const result = await service.login('test@example.com', 'hashedPassword');

    expect(result).toEqual(token);
    expect(userRepository.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedPassword' });
  });
});
