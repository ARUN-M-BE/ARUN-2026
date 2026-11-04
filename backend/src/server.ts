/**
 * Standalone Backend Server Entrypoint
 * Matches backend/src/server.js architecture standard.
 */

import http from "http";
import app from "./app";
import { Logger } from "./utils";
import { db } from "./config/database";
import { sql } from "drizzle-orm";

const PORT = parseInt(process.env.BACKEND_PORT || "4000", 10);
const HOST = process.env.BACKEND_HOST || "0.0.0.0";

const server = http.createServer(app);

async function startServer() {
  try {
    // Probe database connectivity
    try {
      await db.execute(sql`SELECT 1`);
      Logger.info("Database connectivity confirmed");
    } catch (dbErr: any) {
      Logger.warn("Database connection notice (running in standby or check credentials): " + dbErr.message);
    }

    server.listen(PORT, HOST, () => {
      Logger.info(`Backend Server listening at http://${HOST}:${PORT}`);
      Logger.info(`Health check available at http://${HOST}:${PORT}/api/health`);
    });
  } catch (err: any) {
    Logger.error("Failed to start backend server", err);
    process.exit(1);
  }
}

// Graceful termination handling
function handleShutdown(signal: string) {
  Logger.info(`Received ${signal}, gracefully terminating server...`);
  server.close(() => {
    Logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

// Auto-start if invoked directly
if (require.main === module || process.argv[1]?.includes("server.ts") || process.argv[1]?.includes("server.js")) {
  startServer();
}

export { server, startServer };
export default server;

