/**
 * API-FRRM Management Client (https://api.arun-m.in)
 * Handles Edge REST API CRUD operations, schema synchronization, and health monitoring.
 */

import { Logger, formatApiResponse, formatApiError } from "@/server/utils";

export interface ApiClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
}

export class ApiManagementClient {
  private baseUrl: string;
  private apiKey: string | null;
  private timeoutMs: number;

  constructor(config?: Partial<ApiClientConfig>) {
    this.baseUrl = (config?.baseUrl || process.env.NEXT_PUBLIC_API_URL || "https://api.arun-m.in").replace(/\/$/, "");
    this.apiKey = config?.apiKey || process.env.API_MANAGEMENT_KEY || null;
    this.timeoutMs = config?.timeoutMs || 8000;
  }

  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeaders,
    };

    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    return headers;
  }

  async checkHealth(): Promise<{ isOnline: boolean; latencyMs: number; statusCode?: number; error?: string }> {
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const res = await fetch(`${this.baseUrl}/tester`, {
        method: "HEAD",
        headers: this.getHeaders(),
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;
      return {
        isOnline: res.status < 500,
        statusCode: res.status,
        latencyMs,
      };
    } catch (err: any) {
      return {
        isOnline: false,
        latencyMs: Date.now() - start,
        error: err?.name === "AbortError" ? "Request timed out" : err?.message || "Connection failed",
      };
    }
  }

  /**
   * Generic CRUD: GET (Read)
   */
  async get<T = any>(endpoint: string, params?: Record<string, string | number>): Promise<{ data?: T; error?: string }> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: this.getHeaders(),
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text();
        Logger.warn(`API-FRRM GET failed: ${res.status}`, { url: url.toString(), errorText });
        return { error: `HTTP ${res.status}: ${errorText}` };
      }

      const data = await res.json();
      return { data };
    } catch (err: any) {
      Logger.error(`API-FRRM GET Exception`, err, { endpoint });
      return { error: err?.message || "Network error" };
    }
  }

  /**
   * Generic CRUD: POST (Create)
   */
  async post<T = any>(endpoint: string, body: any): Promise<{ data?: T; error?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        Logger.warn(`API-FRRM POST failed: ${res.status}`, { url, errorText });
        return { error: `HTTP ${res.status}: ${errorText}` };
      }

      const data = await res.json();
      return { data };
    } catch (err: any) {
      Logger.error(`API-FRRM POST Exception`, err, { endpoint });
      return { error: err?.message || "Network error" };
    }
  }

  /**
   * Generic CRUD: PUT / PATCH (Update)
   */
  async update<T = any>(endpoint: string, body: any, partial: boolean = false): Promise<{ data?: T; error?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const res = await fetch(url, {
        method: partial ? "PATCH" : "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { error: `HTTP ${res.status}: ${errorText}` };
      }

      const data = await res.json();
      return { data };
    } catch (err: any) {
      Logger.error(`API-FRRM UPDATE Exception`, err, { endpoint });
      return { error: err?.message || "Network error" };
    }
  }

  /**
   * Generic CRUD: DELETE (Remove)
   */
  async delete(endpoint: string): Promise<{ success: boolean; error?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `HTTP ${res.status}: ${errorText}` };
      }

      return { success: true };
    } catch (err: any) {
      Logger.error(`API-FRRM DELETE Exception`, err, { endpoint });
      return { success: false, error: err?.message || "Network error" };
    }
  }
}

export const apiManagement = new ApiManagementClient();

