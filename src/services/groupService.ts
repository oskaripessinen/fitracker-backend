import { GroupModel } from '../models/group';
import { UserModel } from '../models/user';
import { CreateGroupRequest, UpdateGroupRequest, AddMemberRequest } from '../types/group';

export class GroupService {
  // Group CRUD operations
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
      // Validate input
      if (!groupData.name || groupData.name.trim().length === 0) {
        throw new Error('Group name is required');
      }

      if (groupData.name.length > 255) {
        throw new Error('Group name too long');
      }

      // Check if user exists
      const user = await UserModel.findById(groupData.created_by);
      if (!user) {
        throw new Error('User not found');
      }

      // Create group
      const group = await GroupModel.create({
        name: groupData.name.trim(),
        description: groupData.description?.trim(),
        created_by: groupData.created_by
      });

      // Add creator as admin
      await GroupModel.addMember(group.id, groupData.created_by, 'admin');

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

      // Check if user is group creator
      if (group.created_by !== userId) {
        throw new Error('Only group creator can update group');
      }

      // Validate updates
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

  // Member management
  static async addMember(groupId: number, memberData: AddMemberRequest, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Check if user exists
      const user = await UserModel.findById(memberData.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if requester has permission (admin/moderator)
      const requesterRole = await GroupModel.getMemberRole(groupId, requesterId);
      if (!requesterRole || !['admin', 'moderator'].includes(requesterRole)) {
        throw new Error('Permission denied');
      }

      // Check if user is already a member
      const isMember = await GroupModel.isMember(groupId, memberData.user_id);
      if (isMember) {
        throw new Error('User is already a member');
      }

      const member = await GroupModel.addMember(
        groupId, 
        memberData.user_id, 
        memberData.role || 'member'
      );

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

      // Users can remove themselves, or admins/moderators can remove others
      const requesterRole = await GroupModel.getMemberRole(groupId, requesterId);
      const canRemove = requesterId === userId || 
                       (requesterRole && ['admin', 'moderator'].includes(requesterRole));

      if (!canRemove) {
        throw new Error('Permission denied');
      }

      // Don't allow removing group creator
      if (userId === group.created_by) {
        throw new Error('Cannot remove group creator');
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

  static async updateMemberRole(groupId: number, userId: string, newRole: string, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Only admins can change roles
      const requesterRole = await GroupModel.getMemberRole(groupId, requesterId);
      if (requesterRole !== 'admin') {
        throw new Error('Only admins can change member roles');
      }

      // Don't allow changing creator's role
      if (userId === group.created_by) {
        throw new Error('Cannot change group creator role');
      }

      // Validate role
      if (!['admin', 'moderator', 'member'].includes(newRole)) {
        throw new Error('Invalid role');
      }

      const member = await GroupModel.updateMemberRole(groupId, userId, newRole);
      if (!member) {
        throw new Error('User is not a member of this group');
      }

      return member;
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  }

  // Query operations
  static async getGroupMembers(groupId: number, requesterId: string) {
    try {
      const group = await GroupModel.findById(groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Check if requester is a member
      const isMember = await GroupModel.isMember(groupId, requesterId);
      if (!isMember) {
        throw new Error('Permission denied');
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

      // Check if requester is a member
      const isMember = await GroupModel.isMember(groupId, requesterId);
      if (!isMember) {
        throw new Error('Permission denied');
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

      // Check if already a member
      const isMember = await GroupModel.isMember(groupId, userId);
      if (isMember) {
        throw new Error('Already a member of this group');
      }

      const member = await GroupModel.addMember(groupId, userId, 'member');
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

      // Don't allow creator to leave
      if (userId === group.created_by) {
        throw new Error('Group creator cannot leave the group');
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
}