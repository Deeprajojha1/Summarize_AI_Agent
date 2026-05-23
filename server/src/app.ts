import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/corsOptions.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import { errorMiddleware, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok', product: 'NexFlow AI' }));
app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use(notFound);
app.use(errorMiddleware);

export default app;
