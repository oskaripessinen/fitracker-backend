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
  getGroupWithMembers
} from '../controllers/groups';
import { authenticateToken } from '../middleware/auth';

const groupRoutes = express.Router();


groupRoutes.get('/', getGroups);                          
groupRoutes.get('/:id', getGroupById);                    

groupRoutes.post('/', authenticateToken, createGroup);
groupRoutes.put('/:id', updateGroup); 

groupRoutes.get('/:id/members', getGroupMembers);         
groupRoutes.post('/:id/members', addMember);              
groupRoutes.delete('/:id/members/:userId', removeMember); 

groupRoutes.post('/:id/join', joinGroup);                 
groupRoutes.post('/:id/leave',authenticateToken, leaveGroup);                


groupRoutes.get('/:id/details', getGroupWithMembers);


groupRoutes.get('/user/my-groups',authenticateToken, getUserGroups);         

export default groupRoutes;