import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/groupService';
import { 
  AuthenticatedRequest, 
  CreateGroupRequest, 
  UpdateGroupRequest, 
  AddMemberRequest 
} from '../types/group';

export const getGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const groups = await GroupService.getAllGroups();
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    const group = await GroupService.getGroupById(groupId);
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id; 
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const groupData: CreateGroupRequest = {
      name,
      description,
      created_by: userId
    };

    const group = await GroupService.createGroup(groupData);
    
    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const updates: UpdateGroupRequest = req.body;
    const group = await GroupService.updateGroup(groupId, updates, userId);
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupMembers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const members = await GroupService.getGroupMembers(groupId, userId);
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const memberData: AddMemberRequest = req.body;
    const member = await GroupService.addMember(groupId, memberData, userId);
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, userId: targetUserId } = req.params;
    const groupId = parseInt(id);
    const requesterId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!requesterId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const result = await GroupService.removeMember(groupId, targetUserId, requesterId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, userId: targetUserId } = req.params;
    const { role } = req.body;
    const groupId = parseInt(id);
    const requesterId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!requesterId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const member = await GroupService.updateMemberRole(groupId, targetUserId, role, requesterId);
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const member = await GroupService.joinGroup(groupId, userId);
    
    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const result = await GroupService.leaveGroup(groupId, userId);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGroups = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const groups = await GroupService.getUserGroups(userId);
    
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupWithMembers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const groupId = parseInt(id);
    const userId = req.user?.id;
    
    if (isNaN(groupId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid group ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const group = await GroupService.getGroupWithMembers(groupId, userId);
    
    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    next(error);
  }
};