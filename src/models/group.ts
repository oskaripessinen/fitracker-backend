import sql from '../config/database';

export class GroupModel {

  static async findAll() {
    return await sql`SELECT * FROM groups ORDER BY created_at DESC`;
  }

  static async findById(id: number) {
    const groups = await sql`SELECT * FROM groups WHERE id = ${id}`;
    return groups.length > 0 ? groups[0] : null;
  }

  static async create(groupData: {
    name: string;
    description?: string;
    created_by: string;
  }) {
    const groups = await sql`
      INSERT INTO groups (name, description, created_by, created_at, updated_at)
      VALUES (${groupData.name}, ${groupData.description || null}, ${groupData.created_by}, NOW(), NOW())
      RETURNING *
    `;
    return groups[0];
  }

  static async update(id: number, updates: Record<string, any>) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE groups SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const groups = await sql.unsafe(query, values);
    return groups.length > 0 ? groups[0] : null;
  }

  static async addMember(groupId: number, userId: string) {
    const members = await sql`
      INSERT INTO group_members (group_id, user_id, joined_at)
      VALUES (${groupId}, ${userId}, NOW())
      ON CONFLICT (group_id, user_id) DO NOTHING
      RETURNING *
    `;
    return members[0];
  }

  static async removeMember(groupId: number, userId: string) {
    const result = await sql`
      DELETE FROM group_members 
      WHERE group_id = ${groupId} AND user_id = ${userId}
    `;
    return result.count;
  }

  static async getGroupMembers(groupId: number) {
    return await sql`
      SELECT 
        u.google_id AS user_id, u.email, u.full_name, u.avatar,
        gm.joined_at
      FROM group_members gm
      JOIN users u ON gm.user_id = u.google_id
      WHERE gm.group_id = ${groupId}
      ORDER BY gm.joined_at
    `;
  }

  static async getUserGroups(userId: string) {
    return await sql`
      SELECT 
        g.id, g.name, g.description, g.created_at,
        gm.joined_at,
        creator.full_name as creator_name
      FROM group_members gm
      JOIN groups g ON gm.group_id = g.id
      LEFT JOIN users creator ON g.created_by = creator.google_id
      WHERE gm.user_id = ${userId}
      ORDER BY gm.joined_at DESC
    `;
  }

  static async getGroupWithMembers(groupId: number) {
    return await sql`
      SELECT 
        g.id, g.name, g.description, g.created_at,
        creator.google_id as creator_id, creator.full_name as creator_name,
        COALESCE(
          json_agg(
            CASE 
              WHEN gm.user_id IS NOT NULL THEN
                json_build_object(
                  'user_id', gm.user_id,
                  'full_name', u.full_name,
                  'email', u.email,
                  'avatar', u.avatar,
                  'joined_at', gm.joined_at
                )
              ELSE NULL
            END
            ORDER BY gm.joined_at
          ) FILTER (WHERE gm.user_id IS NOT NULL),
          '[]'::json
        ) as members
      FROM groups g
      LEFT JOIN users creator ON g.created_by = creator.google_id
      LEFT JOIN group_members gm ON g.id = gm.group_id
      LEFT JOIN users u ON gm.user_id = u.google_id
      WHERE g.id = ${groupId}
      GROUP BY g.id, creator.google_id, creator.full_name
    `;
  }

  static async isMember(groupId: number, userId: string) {
    const members = await sql`
      SELECT 1 FROM group_members 
      WHERE group_id = ${groupId} AND user_id = ${userId}
    `;
    return members.length > 0;
  }

  static async getGroupsByCreator(creatorId: string) {
    return await sql`
      SELECT * FROM groups 
      WHERE created_by = ${creatorId}
      ORDER BY created_at DESC
    `;
  }

  static async deleteGroup(groupId: number) {
    const result = await sql`
      DELETE FROM groups WHERE id = ${groupId}
    `;
    return result.count;
  }
}