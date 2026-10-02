import express from 'express';
import { prisma } from './db/client';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { createUserController } from './controllers/user.controller';

const app = express();

app.use(express.json());

// Initialize Dependency Chain
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);

// Mount API Routes
app.use('/api/users', createUserController(userService));

// Catch-all 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

export default app;