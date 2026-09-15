import app from './app';
import { prisma } from './db/client';

const PORT = process.env.PORT || 3000;

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown Handler
const shutdown = async (signal: string) => {
  console.log(`\n⚠️ Received ${signal}. Closing server gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connections disconnected.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if connections hang
  setTimeout(() => {
    console.error('Could not close connections in time, forcing shutdown.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));