import sql from '../config/database';

export interface GroupInvite {
  id: number;
  group_id: number;
  inviter_id: string;
  invitee_email: string;
  invitee_id?: string | null;
  status: 'pending' | 'accepted' | 'declined';
  token: string;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface GroupInviteWithDetails extends GroupInvite {
  group_name: string;
  inviter_name: string;
  inviter_email: string;
}

export class GroupInviteModel {
  static async findByToken(token: string): Promise<GroupInviteWithDetails | null> {
    const invites = await sql<GroupInviteWithDetails[]>`
      SELECT 
        gi.*,
        g.name as group_name,
        u.full_name as inviter_name,
        u.email as inviter_email
      FROM group_invites gi
      JOIN groups g ON gi.group_id = g.id
      JOIN users u ON gi.inviter_id = u.google_id
      WHERE gi.token = ${token}
    `;
    
    return invites.length > 0 ? invites[0] : null;
  }

  static async updateStatus(token: string, status: 'accepted' | 'declined'): Promise<GroupInvite | null> {
    const invites = await sql<GroupInvite[]>`
      UPDATE group_invites 
      SET status = ${status}, updated_at = NOW()
      WHERE token = ${token} AND status = 'pending' AND expires_at > NOW()
      RETURNING *
    `;
    
    return invites.length > 0 ? invites[0] : null;
  }

  static async create(inviteData: Omit<GroupInvite, 'id' | 'created_at' | 'updated_at'>): Promise<GroupInvite> {
    const invites = await sql<GroupInvite[]>`
      INSERT INTO group_invites (group_id, inviter_id, invitee_email, invitee_id, status, token, expires_at)
      VALUES (${inviteData.group_id}, ${inviteData.inviter_id}, ${inviteData.invitee_email}, ${inviteData.invitee_id || null}, ${inviteData.status}, ${inviteData.token}, ${inviteData.expires_at})
      RETURNING *
    `;
    
    return invites[0];
  }

  static async findPendingByEmailAndGroup(email: string, groupId: number): Promise<GroupInvite | null> {
    const invites = await sql<GroupInvite[]>`
      SELECT * FROM group_invites 
      WHERE invitee_email = ${email} 
        AND group_id = ${groupId} 
        AND status = 'pending' 
        AND expires_at > NOW()
    `;
    
    return invites.length > 0 ? invites[0] : null;
  }

  static async findPendingInvitesForUser(userId: string): Promise<GroupInviteWithDetails[]> {
    const invites = await sql<GroupInviteWithDetails[]>`
      SELECT 
        gi.id,
        gi.group_id,
        gi.inviter_id,
        gi.invitee_email,
        gi.invitee_id,
        gi.status,
        gi.token,
        gi.expires_at,
        gi.created_at,
        gi.updated_at,
        g.name as group_name,
        u.full_name as inviter_name,
        u.email as inviter_email
      FROM group_invites gi
      JOIN groups g ON gi.group_id = g.id
      JOIN users u ON gi.inviter_id = u.google_id
      WHERE (gi.invitee_id = ${userId} OR gi.invitee_email = (SELECT email FROM users WHERE google_id = ${userId}))
        AND gi.status = 'pending'
        AND gi.expires_at > NOW()
      ORDER BY gi.created_at DESC
    `;
    
    return invites;
  }

  static async findById(id: number): Promise<GroupInviteWithDetails | null> {
    const invites = await sql<GroupInviteWithDetails[]>`
      SELECT 
        gi.*,
        g.name as group_name,
        u.full_name as inviter_name,
        u.email as inviter_email
      FROM group_invites gi
      JOIN groups g ON gi.group_id = g.id
      JOIN users u ON gi.inviter_id = u.google_id
      WHERE gi.id = ${id}
    `;
    
    return invites.length > 0 ? invites[0] : null;
  }

  static async updateStatusById(id: number, status: 'accepted' | 'declined'): Promise<GroupInvite | null> {
    const invites = await sql<GroupInvite[]>`
      UPDATE group_invites 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} AND status = 'pending' AND expires_at > NOW()
      RETURNING *
    `;
    
    return invites.length > 0 ? invites[0] : null;
  }
}