import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import usersRoutes from './routes/usersRoute';
import authRoutes from './routes/authRoute';
import groupRoutes from './routes/groupRoutes';
import expenseRoutes from './routes/expenseRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes)
app.use(errorHandler);

export default app;
