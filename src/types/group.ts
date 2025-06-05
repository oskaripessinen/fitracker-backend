import { Request } from 'express';

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface GroupMember {
  group_id: number;
  user_id: string;
  joined_at: Date;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  created_by: string;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
}

export interface AddMemberRequest {
  user_id: string;
  role?: 'admin' | 'moderator' | 'member';
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface GroupResponse {
  success: boolean;
  data: Group;
}

export interface GroupsResponse {
  success: boolean;
  count: number;
  data: Group[];
}

export interface GroupMembersResponse {
  success: boolean;
  count: number;
  data: GroupMember[];
}