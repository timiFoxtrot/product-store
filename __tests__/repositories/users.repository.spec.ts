import 'reflect-metadata';
import { UserRepository } from '../../src/repositories/users.repository';
import User, { IUser } from '../../src/models/users.model';
import { mock, MockProxy } from 'jest-mock-extended';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../src/models/users.model');

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUserModel: MockProxy<typeof User>;

  beforeEach(() => {
    repository = new UserRepository();
    mockUserModel = mock<typeof User>();
    User.findOne = mockUserModel.findOne;
  });

  it('should create a new user', async () => {
    const user: IUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    } as IUser;

    const saveMock = jest.fn().mockResolvedValue({ ...user, _id: 'user-id' });
    const userInstance = { save: saveMock };

    (User as unknown as jest.Mock).mockImplementation(() => userInstance);

    const result = await repository.create(user);
    expect(result).toEqual({ ...user, _id: 'user-id' });
    expect(saveMock).toHaveBeenCalled();
  });

  it('should throw error if email is already taken', async () => {
    const user: IUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    } as IUser;

    (User.findOne as jest.Mock).mockResolvedValueOnce(user);
    await expect(repository.create(user)).rejects.toThrow('Email already taken');
  });

  it('should login user with valid credentials', async () => {
    const user: IUser = {
      _id: 'user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
    } as IUser;

    (User.findOne as jest.Mock).mockResolvedValueOnce(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

    jest.spyOn(jwt, 'sign').mockImplementation(() => 'mockToken');

    const result = await repository.login({ email: 'test@example.com', password: 'hashedPassword' });
    expect(result).toEqual('mockToken');
  });

  it('should throw error for invalid credentials', async () => {
    const user: IUser = {
      _id: 'user-id',
      email: 'test@example.com',
      password: 'hashedPassword',
    } as IUser;

    (User.findOne as jest.Mock).mockResolvedValueOnce(user);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);


    await expect(repository.login({ email: 'test@example.com', password: 'wrongPassword' })).rejects.toThrow('Invalid credentials');
  });
});
