import { GroupModel } from '../models/group';
import { UserModel } from '../models/user';
import { CreateGroupRequest, UpdateGroupRequest, AddMemberRequest } from '../types/group';
import { GroupInviteModel } from '../models/groupInvite';
import crypto from 'crypto';

export class GroupService {

  static async getAllGroups() {
    try {
      const groups = await GroupModel.findAll();
      return groups;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups');
    }
  }

  static async getGroupById(id: number) {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        throw new Error('Group not found');
      }
      return group;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw new Error('Failed to fetch group');
    }
  }

  static async createGroup(groupData: CreateGroupRequest) {
    try {
      if (!groupData.name || groupData.name.trim().length === 0) {
        throw new Error('Group name is required');
      }

      if (groupData.name.length > 255) {
        throw new Error('Group name too long');
      }

      const user = await UserModel.findById(groupData.created_by);
      if (!user) {
        throw new Error('User not found');
      }

      const group = await GroupModel.create({
        name: groupData.name.trim(),
        description: groupData.description?.trim(),
        created_by: groupData.created_by
      });

      await GroupModel.addMember(group.id, groupData.created_by);

      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  static async updateGroup(id: number, updates: UpdateGroupRequest, userId: string) {
    try {
      const group = await GroupModel.findById(id);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = await GroupModel.isMember(id, userId);
      if (!isMember) {
        throw new Error('Only group members can update group');
      }

      if (updates.name !== undefined) {
        if (!updates.name || updates.name.trim().length === 0) {
          throw new Error('Group name cannot be empty');
        }
        if (updates.name.length > 255) {
          throw new Error('Group name too long');
        }
        updates.name = updates.name.trim();
      }

      if (updates.description !== undefined) {
        updates.description = updates.description?.trim();
      }

      const updatedGroup = await GroupModel.update(id, updates);
      return updatedGroup;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }

  static async addMember(groupId: number, memberData: AddMemberRequest, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const user = await UserModel.findById(memberData.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      const isRequesterMember = await GroupModel.isMember(groupId, requesterId);
      if (!isRequesterMember) {
        throw new Error('Only group members can add new members');
      }

      const isMember = await GroupModel.isMember(groupId, memberData.user_id);
      if (isMember) {
        throw new Error('User is already a member');
      }

      const member = await GroupModel.addMember(groupId, memberData.user_id);
      return member;
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }

  static async removeMember(groupId: number, userId: string, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isRequesterMember = await GroupModel.isMember(groupId, requesterId);
      if (!isRequesterMember) {
        throw new Error('Only group members can remove members');
      }

      const result = await GroupModel.removeMember(groupId, userId);
      if (result === 0) {
        throw new Error('User is not a member of this group');
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  static async getGroupMembers(groupId: number, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = await GroupModel.isMember(groupId, requesterId);
      if (!isMember) {
        throw new Error('Only group members can view member list');
      }

      const members = await GroupModel.getGroupMembers(groupId);
      return members;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  }

  static async getUserGroups(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const groups = await GroupModel.getUserGroups(userId);
      return groups;
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  }

  static async getGroupWithMembers(groupId: number, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = await GroupModel.isMember(groupId, requesterId);
      if (!isMember) {
        throw new Error('Only group members can view group details');
      }

      const groupWithMembers = await GroupModel.getGroupWithMembers(groupId);
      return groupWithMembers.length > 0 ? groupWithMembers[0] : null;
    } catch (error) {
      console.error('Error fetching group with members:', error);
      throw error;
    }
  }

  static async joinGroup(groupId: number, userId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isMember = await GroupModel.isMember(groupId, userId);
      if (isMember) {
        throw new Error('Already a member of this group');
      }

      const member = await GroupModel.addMember(groupId, userId);
      return member;
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  static async leaveGroup(groupId: number, userId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const result = await GroupModel.removeMember(groupId, userId);
      if (result === 0) {
        throw new Error('You are not a member of this group');
      }

      return { success: true };
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  static async deleteGroup(groupId: number, userId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const isMember = await GroupModel.isMember(groupId, userId);
      if (!isMember) {
        throw new Error('Only group members can delete the group');
      }

      const result = await GroupModel.deleteGroup(groupId);
      if (result === 0) {
        throw new Error('Failed to delete group');
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  }
  static async inviteUserByEmail(groupId: number, email: string, inviterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      const inviter = await UserModel.findById(inviterId);
      if (!inviter) {
        throw new Error('Inviter not found');
      }

      const isInviterMember = await GroupModel.isMember(groupId, inviterId);
      if (!isInviterMember) {
        throw new Error('Only group members can send invitations');
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        const isMember = await GroupModel.isMember(groupId, existingUser.google_id);
        if (isMember) {
          throw new Error('User is already a member of this group');
        }
      }

      const existingInvite = await GroupInviteModel.findPendingByEmailAndGroup(email, groupId);
      if (existingInvite) {
        throw new Error('Invitation already sent to this email');
      }

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const inviteData = {
        group_id: groupId,
        inviter_id: inviterId,
        invitee_email: email,
        invitee_id: existingUser?.google_id || null, 
        status: 'pending' as const,
        token,
        expires_at: expiresAt
      };

      const invite = await GroupInviteModel.create(inviteData);

      await this.sendInviteEmail(email, token, group.name, inviter.name);

      return {
        id: invite.id,
        group_id: invite.group_id,
        invitee_email: invite.invitee_email,
        status: invite.status,
        created_at: invite.created_at
      };
    } catch (error) {
      console.error('Error inviting user by email:', error);
      throw error;
    }
  }

  private static async sendInviteEmail(email: string, token: string, groupName: string, inviterName: string) {
    console.log(`Sending invite email to ${email} for group ${groupName} from ${inviterName} with token ${token}`);
  }

  static async getGroupInvites(token: string) {
    try {
      const invite = await GroupInviteModel.findByToken(token);
      if (!invite) {
        throw new Error('Invitation not found or expired');
      }

      if (invite.status !== 'pending') {
        throw new Error('Invitation is no longer pending');
      }

      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      return invite;
    } catch (error) {
      console.error('Error fetching group invite:', error);
      throw error;
    }
  }

  static async acceptGroupInvite(token: string, userId: string) {
    try {
      const invite = await GroupInviteModel.findByToken(token);
      if (!invite) {
        throw new Error('Invitation not found or expired');
      }

      if (invite.status !== 'pending') {
        throw new Error('Invitation is no longer pending');
      }

      if (new Date(invite.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (invite.invitee_id && invite.invitee_id !== userId) {
        throw new Error('This invitation is not for you');
      }

      if (!invite.invitee_id && invite.invitee_email !== user.email) {
        throw new Error('This invitation is not for you');
      }

      const isMember = await GroupModel.isMember(invite.group_id, userId);
      if (isMember) {
        throw new Error('You are already a member of this group');
      }

      await GroupModel.addMember(invite.group_id, userId);

      await GroupInviteModel.updateStatus(token, 'accepted');

      return { message: 'Successfully joined the group' };
    } catch (error) {
      console.error('Error accepting group invite:', error);
      throw error;
    }
  }

  static async declineGroupInvite(token: string, userId?: string) {
    try {
      const invite = await GroupInviteModel.findByToken(token);
      if (!invite) {
        throw new Error('Invitation not found or expired');
      }

      if (invite.status !== 'pending') {
        throw new Error('Invitation is no longer pending');
      }

      if (userId) {
        const user = await UserModel.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }

        if (invite.invitee_id && invite.invitee_id !== userId) {
          throw new Error('This invitation is not for you');
        }

        if (!invite.invitee_id && invite.invitee_email !== user.email) {
          throw new Error('This invitation is not for you');
        }
      }

      await GroupInviteModel.updateStatus(token, 'declined');

      return { message: 'Invitation declined' };
    } catch (error) {
      console.error('Error declining group invite:', error);
      throw error;
    }
  }

}