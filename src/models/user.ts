import sql from '../config/database';
import { User } from '../types/user';

export class UserModel {
  static async findAll() {
    return await sql`SELECT * FROM users ORDER BY created_at DESC`;
  }

  static async findById(id: string) {
    const users = await sql`SELECT * FROM users WHERE google_id = ${id}`;
    return users.length > 0 ? users[0] : null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const users = await sql<User[]>`SELECT * FROM users WHERE email = ${email}`;
    return users.length > 0 ? users[0] : null;
  }

  static async create(userData: {
    id: string;
    email: string;
    full_name: string;
    avatar?: string;
  }) {
    const users = await sql`
      INSERT INTO users (google_id, email, full_name, avatar, created_at, updated_at)
      VALUES (${userData.id}, ${userData.email}, ${userData.full_name}, ${userData.avatar || null}, NOW(), NOW())
      RETURNING *
    `;
    return users[0];
  }

  static async update(id: string, updates: Record<string, any>) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE users SET ${setClause}, updated_at = NOW() WHERE google_id = $${values.length} RETURNING *`;
    const users = await sql.unsafe(query, values);
    return users.length > 0 ? users[0] : null;
  }

  static async delete(id: string) {
    const result = await sql`DELETE FROM users WHERE google_id = ${id}`;
    return result.count;
  }
}