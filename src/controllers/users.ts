import { Request, Response, NextFunction } from 'express';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserResponse, 
  UsersResponse, 
  ApiResponse 
} from '../types';
import { UserService } from '../services/userService';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    
    const response: UsersResponse = {
      success: true,
      count: users.length,
      data: users
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);
    
    if (!user) {
      const errorResponse: ApiResponse = {
        success: false,
        error: 'User not found'
      };
      res.status(404).json(errorResponse);
      return;
    }

    const response: UserResponse = {
      success: true,
      data: user
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request<{}, UserResponse, CreateUserRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userData: CreateUserRequest = req.body;
    const user = await UserService.createUser(userData);
    
    const response: UserResponse = {
      success: true,
      data: user
    };
    
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request<{ id: string }, UserResponse, UpdateUserRequest>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userData: UpdateUserRequest = req.body;
    const user = await UserService.updateUser(id, userData);
    
    const response: UserResponse = {
      success: true,
      data: user
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await UserService.deleteUser(id);
    
    const response: ApiResponse = {
      success: true,
      data: {}
    };
    
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};