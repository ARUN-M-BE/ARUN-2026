import bcrypt from "bcryptjs";
import { type ActionResult } from "@/server/constants";

/**
 * Server utilities for cryptography, formatting, standard responses, and observability.
 * Follows the backend-development skill specification (API Design, Observability, Security).
 */

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSuccessResult<T>(data: T, message?: string): ActionResult<T> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
}

export function createErrorResult<T = undefined>(error: string): ActionResult<T> {
  return {
    success: false,
    error,
  };
}

/**
 * Standard RESTful response envelope
 */
export function formatApiResponse<T>(data: T, meta?: { page?: number; per_page?: number; total?: number }) {
  return {
    data,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Standard error response envelope
 */
export function formatApiError(code: string, message: string, details?: Array<{ field?: string; message: string }>) {
  return {
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
}

/**
 * Structured Logger with Request IDs / Correlation IDs
 */
export const Logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        message,
        ...context,
      })
    );
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        message,
        ...context,
      })
    );
  },
  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        message,
        error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
        ...context,
      })
    );
  },
};

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
