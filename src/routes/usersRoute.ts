import express from 'express';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../controllers/users';

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);

export default usersRouter;