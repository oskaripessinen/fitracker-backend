import express from 'express';
import {
  getGroups,
  getGroupById,
  createGroup,
  updateGroup,
  getGroupMembers,
  addMember,
  removeMember,
  updateMemberRole,
  joinGroup,
  leaveGroup,
  getUserGroups,
  getGroupWithMembers
} from '../controllers/groups';
import { authenticateToken } from '../middleware/auth';

const groupRoutes = express.Router();

// Public routes (no authentication required)
groupRoutes.get('/', getGroups);                           // GET /api/groups
groupRoutes.get('/:id', getGroupById);                     // GET /api/groups/:id

// Protected routes (authentication required)

groupRoutes.post('/',authenticateToken, createGroup);
groupRoutes.put('/:id', updateGroup); 

// Group member routes
groupRoutes.get('/:id/members', getGroupMembers);          // GET /api/groups/:id/members
groupRoutes.post('/:id/members', addMember);               // POST /api/groups/:id/members
groupRoutes.delete('/:id/members/:userId', removeMember);  // DELETE /api/groups/:id/members/:userId
groupRoutes.put('/:id/members/:userId', updateMemberRole); // PUT /api/groups/:id/members/:userId

// Join/Leave routes
groupRoutes.post('/:id/join', joinGroup);                  // POST /api/groups/:id/join
groupRoutes.post('/:id/leave', leaveGroup);                // POST /api/groups/:id/leave

// Get group with all member details
groupRoutes.get('/:id/details', getGroupWithMembers);      // GET /api/groups/:id/details

// User's groups
groupRoutes.get('/user/my-groups', getUserGroups);         // GET /api/groups/user/my-groups

export default groupRoutes;