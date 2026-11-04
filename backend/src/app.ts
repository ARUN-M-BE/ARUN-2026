/**
 * Application Request Dispatcher & Middleware Orchestrator
 * Matches the classic backend/src/app.js architecture standard.
 */

import http from "http";
import { ServerRoutes } from "./routes";
import { Logger, formatApiResponse, formatApiError } from "./utils";
import { rateLimiter } from "./middleware/rate-limit";

export interface RequestContext {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  url: URL;
  pathname: string;
  method: string;
}

export async function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        // 1MB limit
        reject(new Error("Payload Too Large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

export function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  });
  res.end(json);
}

/**
 * Core Request Handler / Application Pipeline
 */
export async function app(req: http.IncomingMessage, res: http.ServerResponse) {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  const pathname = url.pathname;
  const method = req.method?.toUpperCase() || "GET";

  // Handle CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    });
    res.end();
    return;
  }

  // Rate Limiting check
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
  const rateLimitResult = rateLimiter.check(clientIp);
  if (!rateLimitResult.allowed) {
    sendJson(res, 429, formatApiError("RATE_LIMIT_EXCEEDED", "Too many requests, please slow down."));
    return;
  }

  const startTime = Date.now();

  try {
    // Health probe
    if (pathname === "/api/health" || pathname === "/health") {
      sendJson(res, 200, {
        status: "healthy",
        service: "portfolio-backend",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
      return;
    }

    // Public Portfolio Bundle
    if (pathname === "/api/portfolio" && method === "GET") {
      const data = await ServerRoutes.public.getPortfolioData();
      sendJson(res, 200, formatApiResponse(data));
      return;
    }

    // Projects endpoint
    if (pathname === "/api/projects" && method === "GET") {
      const projects = await ServerRoutes.public.getProjects();
      sendJson(res, 200, formatApiResponse(projects));
      return;
    }

    // Skills endpoint
    if (pathname === "/api/skills" && method === "GET") {
      const skills = await ServerRoutes.public.getSkills();
      sendJson(res, 200, formatApiResponse(skills));
      return;
    }

    // Profile endpoint
    if (pathname === "/api/profile" && method === "GET") {
      const profile = await ServerRoutes.public.getProfile();
      sendJson(res, 200, formatApiResponse(profile));
      return;
    }

    // Contact submission
    if (pathname === "/api/contact" && method === "POST") {
      const body = await parseJsonBody(req);
      const result = await ServerRoutes.public.submitContactMessage(body);
      if (result.success) {
        sendJson(res, 201, formatApiResponse(result.data));
      } else {
        sendJson(res, 400, formatApiError("BAD_REQUEST", result.error || "Submission failed"));
      }
      return;
    }

    // Not found
    sendJson(res, 404, formatApiError("NOT_FOUND", `Endpoint not found: ${method} ${pathname}`));
  } catch (error: any) {
    Logger.error("Backend request processing error", error, { method, pathname });
    sendJson(res, 500, formatApiError("INTERNAL_ERROR", error.message || "Internal server error"));
  } finally {
    Logger.info(`${method} ${pathname}`, {
      durationMs: Date.now() - startTime,
      ip: clientIp,
    });
  }
}

export default app;
