import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import usersRoutes from './routes/usersRoute';
import authRoutes from './routes/authRoute';
import groupRoutes from './routes/groupRoutes';
import incomeRoutes from './routes/incomeRoutes';
import expenseRoutes from './routes/expenseRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', usersRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/income', incomeRoutes);

app.use(errorHandler);

export default app;
