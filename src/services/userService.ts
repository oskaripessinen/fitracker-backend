import sql from '../config/database';
import { UserModel } from '../models/user';
import { User, CreateUserRequest, UpdateUserRequest } from '../types';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    try {
      const rows = await UserModel.findAll();
      return rows.map(row => ({
        google_id: row.google_id,
        email: row.email,
        full_name: row.full_name,
        avatar: row.avatar_url,
        createdAt: row.created_at,
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const row = await UserModel.findById(id);
      if (!row) return null;
      
      return {
        google_id: row.id,
        email: row.email,
        full_name: row.full_name,
        avatar: row.avatar,
        createdAt: row.created_at,
      } as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      // Business validation
      if (!userData.email || !userData.full_name) {
        throw new Error('Email and full name are required');
      }

      const row = await UserModel.create({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        avatar: userData.avatar
      });
      
      return {
        google_id: row.id,
        email: row.email,
        full_name: row.full_name,
        avatar: row.avatar,
        createdAt: row.created_at,
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
  
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      // Rakenna UPDATE kysely dynaamisesti vain ei-undefined arvoille
      const updates: string[] = [];
      const values: any[] = [];
      
      if (userData.email !== undefined) {
        updates.push('email = $' + (values.length + 1));
        values.push(userData.email);
      }
      if (userData.username !== undefined) {
        updates.push('username = $' + (values.length + 1));
        values.push(userData.username);
      }
      if (userData.firstName !== undefined) {
        updates.push('first_name = $' + (values.length + 1));
        values.push(userData.firstName);
      }
      if (userData.lastName !== undefined) {
        updates.push('last_name = $' + (values.length + 1));
        values.push(userData.lastName);
      }
      if (userData.avatar !== undefined) {
        updates.push('avatar = $' + (values.length + 1));
        values.push(userData.avatar);
      }
      if (userData.isActive !== undefined) {
        updates.push('is_active = $' + (values.length + 1));
        values.push(userData.isActive);
      }
      
      updates.push('updated_at = NOW()');
      values.push(id);
      
      if (updates.length === 1) { // Vain updated_at
        throw new Error('No fields to update');
      }
      
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`;
      const users = await sql.unsafe(query, values);
      
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      const row = users[0];
      return {
        google_id: row.google_id,
        email: row.email,
        full_name: row.full_name,
        avatar: row.avatar_url,
        createdAt: row.created_at,
      } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const result = await sql`DELETE FROM users WHERE id = ${id}`;
      if (result.count === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}