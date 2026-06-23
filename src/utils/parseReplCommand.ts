import { METHODS } from "../constants/constants.js";
import type { Method } from "../types/request.js";

export interface ParsedCommand {
  type: "request" | "system" | "invalid";
  method: Method;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string; // stringified JSON
  systemCmd?: string;
  systemArgs?: string[];
  error?: string;
}

// Tokenize supporting quotes (e.g. key="val with spaces" or Header:"bearer token")
export function tokenize(str: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    
    // Toggle quotes
    if ((char === '"' || char === "'") && (i === 0 || str[i - 1] !== "\\")) {
      if (inQuotes && char === quoteChar) {
        inQuotes = false;
      } else if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else {
        current += char;
      }
    } else if (char === " " && !inQuotes) {
      if (current.trim()) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    tokens.push(current);
  }
  return tokens;
}

export function parseReplCommand(input: string, baseUrl?: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { type: "invalid", error: "Empty command", method: "GET", url: "", headers: {}, queryParams: {}, body: "" };
  }

  const tokens = tokenize(trimmed);
  const firstToken = tokens[0]!;

  // 1. Check for system command (starts with /)
  if (firstToken.startsWith("/")) {
    return {
      type: "system",
      systemCmd: firstToken.slice(1).toLowerCase(),
      systemArgs: tokens.slice(1),
      method: "GET",
      url: "",
      headers: {},
      queryParams: {},
      body: ""
    };
  }

  // 2. Parse request command
  let method: Method = "GET";
  let rawUrl = "";
  let argTokens: string[] = [];

  const upperFirst = firstToken.toUpperCase();
  if (METHODS.includes(upperFirst as Method)) {
    method = upperFirst as Method;
    rawUrl = tokens[1] ?? "";
    argTokens = tokens.slice(2);
  } else {
    // Implicit GET
    method = "GET";
    rawUrl = firstToken;
    argTokens = tokens.slice(1);
  }

  if (!rawUrl) {
    return { type: "invalid", error: "Missing URL", method, url: "", headers: {}, queryParams: {}, body: "" };
  }

  // Interpolate Base URL if relative path
  let finalUrl = rawUrl;
  if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
    if (finalUrl.startsWith("/")) {
      if (baseUrl) {
        finalUrl = `${baseUrl.replace(/\/$/, "")}${finalUrl}`;
      } else {
        finalUrl = `http://localhost${finalUrl}`;
      }
    } else {
      finalUrl = `http://${finalUrl}`;
    }
  }

  // Parse HTTPie arguments
  const headers: Record<string, string> = {};
  const queryParams: Record<string, string> = {};
  const bodyFields: Record<string, unknown> = {};

  for (const token of argTokens) {
    // A. Header (Key:Val) - must not match a URL scheme like http:
    const headerMatch = token.match(/^([a-zA-Z0-9_-]+):(.*)$/);
    if (headerMatch) {
      const [, key, val] = headerMatch;
      if (key && val) {
        headers[key] = val;
        continue;
      }
    }

    // B. JSON body field (Key:=JSONVal)
    const jsonMatch = token.match(/^([a-zA-Z0-9_-]+):=(.*)$/);
    if (jsonMatch) {
      const [, key, val] = jsonMatch;
      if (key && val) {
        try {
          bodyFields[key] = JSON.parse(val);
        } catch {
          // If JSON parse fails, treat it as a string
          bodyFields[key] = val;
        }
        continue;
      }
    }

    // C. Query Param or String Body Field (Key=Val)
    const equalsMatch = token.match(/^([a-zA-Z0-9_-]+)=(.*)$/);
    if (equalsMatch) {
      const [, key, val] = equalsMatch;
      if (key && val) {
        if (["GET", "HEAD", "OPTIONS"].includes(method)) {
          queryParams[key] = val;
        } else {
          bodyFields[key] = val;
        }
        continue;
      }
    }
  }

  // Build body string if there are body fields
  let bodyStr = "";
  if (Object.keys(bodyFields).length > 0) {
    bodyStr = JSON.stringify(bodyFields);
  }

  return {
    type: "request",
    method,
    url: finalUrl,
    headers,
    queryParams,
    body: bodyStr
  };
}
