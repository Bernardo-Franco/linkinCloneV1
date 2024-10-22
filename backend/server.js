import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import userRoutes from './routes/user.route.js';
import notificationRoutes from './routes/notificacion.route.js';
import connectionRoutes from './routes/connection.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// the following option "limit" prevents the error for the transport of the images payload
app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/connections', connectionRoutes);

app.listen(PORT, () => {
  console.log('server running, listening on port: ' + PORT);
  connectDB();
});
