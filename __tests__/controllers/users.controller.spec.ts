import 'reflect-metadata';
import { Request, Response } from 'express';
import { UserService } from '../../src/services/users.service';
import { UserController } from '../../src/controllers/users.controller';
import { mock, MockProxy } from 'jest-mock-extended';
import { userSchema } from '../../src/common/validator';
import { ValidationError } from 'joi';

describe('UserController', () => {
  let userController: UserController;
  let userService: MockProxy<UserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userService = mock<UserService>();
    userController = new UserController(userService);

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should create a new user', async () => {
    // Mock the register function to return the expected user
    const mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'HashedPassword1',
      },
    } as unknown as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    userService.register.mockResolvedValueOnce({ ...mockReq.body, _id: 'user-id' });

    await userController.createUser(mockReq, mockRes);

    // Verify the service was called with the correct arguments
    expect(userService.register).toHaveBeenCalledWith(mockReq.body);

    // Verify the response
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: {
        _id: "user-id",
        name: 'Test User',
        email: 'test@example.com',
        password: 'HashedPassword1',
      },
    });
  });

  it('should return validation error when invalid data is provided', async () => {
    const mockValidationError: ValidationError = {
      name: 'ValidationError',
      isJoi: true,
      message: 'Validation failed',
      details: [
        {
          message: '"name" is required',
          path: ['name'],
          type: 'any.required',
          context: { key: 'name', label: 'name' },
        },
      ],
      annotate: () => '',
      _original: {},
    };

    jest.spyOn(userSchema, 'validate').mockReturnValueOnce({ error: mockValidationError, value: {} });

    const mockReq = {
      body: {}, // Empty body to simulate missing required fields
    } as Request;

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await userController.createUser(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation failed',
      details: ['"name" is required'],
    });
  });

  it('should login a user', async () => {
    const token = 'mockToken';
    req.body = { email: 'test@example.com', password: 'hashedPassword' };
    userService.login.mockResolvedValueOnce(token);

    await userController.login(req as Request, res as Response);
    expect(userService.login).toHaveBeenCalledWith('test@example.com', 'hashedPassword');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: token });
  });
});
