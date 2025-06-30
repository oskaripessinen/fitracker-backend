import express from 'express';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  getGroupMembers,
  addMember,
  removeMember,
  joinGroup,
  leaveGroup,
  getUserGroups,
  getGroupWithMembers,
  inviteUserToGroup,
  getGroupInvites,
  acceptGroupInvite,
  declineGroupInvite,
  getUserInvites
} from '../controllers/groups';
import { authenticateToken } from '../middleware/auth';

const groupRoutes = express.Router();


groupRoutes.get('/', getGroups);
groupRoutes.post('/', authenticateToken, createGroup);

groupRoutes.get('/user/my-groups', authenticateToken, getUserGroups);
groupRoutes.get('/user/invites', authenticateToken, getUserInvites);

groupRoutes.post('/invites/:token/accept', authenticateToken, acceptGroupInvite);
groupRoutes.post('/invites/:token/decline', authenticateToken, declineGroupInvite);


groupRoutes.get('/:id', getGroupById);
groupRoutes.put('/:id', authenticateToken, updateGroup);
groupRoutes.get('/:id/details', authenticateToken, getGroupWithMembers); 
groupRoutes.get('/:id/members', authenticateToken, getGroupMembers);
groupRoutes.post('/:id/members', authenticateToken, addMember); 
groupRoutes.delete('/:id/members/:userId', authenticateToken, removeMember); 
groupRoutes.post('/:id/join', authenticateToken, joinGroup); 
groupRoutes.post('/:id/leave', authenticateToken, leaveGroup);
groupRoutes.post('/:id/invite', authenticateToken, inviteUserToGroup);

export default groupRoutes;