const { exec } = require('child_process');
const server = require('./app');
const { config } = require('./config/config');
const connectDB = require('./config/db');
const { seedPlans } = require('./services/subscriptionService');
const { initNotificationWorker } = require('./services/notificationService');
const logger = require('./utils/logger');

const PORT = config.PORT;

/**
 * Kill the process occupying the given port (Windows-only).
 * Returns a promise that resolves once the port is freed.
 */
const killPortProcess = (port) =>
  new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (err || !stdout) return resolve();

      const pids = new Set();
      for (const line of stdout.trim().split('\n')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') pids.add(pid);
      }

      if (pids.size === 0) return resolve();

      let remaining = pids.size;
      for (const pid of pids) {
        exec(`taskkill /PID ${pid} /F`, (killErr) => {
          if (!killErr)
            logger.warn(`Killed stale process ${pid} on port ${port}`);
          if (--remaining === 0) {
            // Short delay to let the OS release the port
            setTimeout(resolve, 500);
          }
        });
      }
    });
  });

const startServer = async () => {
  await connectDB();
  await seedPlans();
  initNotificationWorker();

  const httpServer = server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      port: PORT,
      env: config.ENV,
    });
  });

  // ── Handle port-in-use: kill the stale process & retry once ──
  httpServer.on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${PORT} in use — attempting to free it…`);
      await killPortProcess(PORT);

      httpServer.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} (after freeing port)`, {
          port: PORT,
          env: config.ENV,
        });
      });
    } else {
      logger.error('Server error:', err);
      process.exit(1);
    }
  });

  // ── Graceful shutdown ──
  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully…`);
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force exit after 5 s if connections linger
    setTimeout(() => process.exit(1), 5000);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

// ── Global safety nets ──
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

startServer();
