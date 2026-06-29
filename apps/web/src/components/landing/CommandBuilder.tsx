"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function CommandBuilder() {
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET");
  const [path, setPath] = useState("/posts");
  const [headersText, setHeadersText] = useState("Authorization: Bearer token123");
  const [bodyJson, setBodyJson] = useState('{\n  "title": "New Post",\n  "published": true\n}');

  const [copied, setCopied] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [parsedBodyArgs, setParsedBodyArgs] = useState<{ key: string; val: string; isJson: boolean }[]>([]);

  // Parse headers text area into individual headers
  const getParsedHeaders = () => {
    const lines = headersText.split("\n");
    const result: { key: string; val: string }[] = [];
    lines.forEach((line) => {
      const idx = line.indexOf(":");
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key) {
          result.push({ key, val });
        }
      }
    });
    return result;
  };

  // Parse JSON Body and convert to CLI argument strings
  useEffect(() => {
    if (method === "GET" || method === "DELETE") {
      setParsedBodyArgs([]);
      setIsJsonValid(true);
      return;
    }

    if (!bodyJson.trim()) {
      setParsedBodyArgs([]);
      setIsJsonValid(true);
      return;
    }

    try {
      const parsed = JSON.parse(bodyJson);
      setIsJsonValid(true);

      const args: { key: string; val: string; isJson: boolean }[] = [];

      const traverse = (obj: any, currentPrefix = "") => {
        if (obj === null) {
          args.push({ key: currentPrefix, val: "null", isJson: true });
          return;
        }

        if (typeof obj === "object") {
          if (Array.isArray(obj)) {
            // Arrays are treated as raw JSON
            args.push({
              key: currentPrefix + "[]",
              val: JSON.stringify(obj),
              isJson: true,
            });
          } else {
            // Objects are traversed
            Object.keys(obj).forEach((key) => {
              const fullKey = currentPrefix ? `${currentPrefix}[${key}]` : key;
              traverse(obj[key], fullKey);
            });
          }
        } else if (typeof obj === "string") {
          // Wrap strings in quotes if containing spaces
          const escaped = obj.includes(" ") ? `"${obj}"` : obj;
          args.push({ key: currentPrefix, val: escaped, isJson: false });
        } else if (typeof obj === "number" || typeof obj === "boolean") {
          args.push({ key: currentPrefix, val: String(obj), isJson: true });
        }
      };

      traverse(parsed);
      setParsedBodyArgs(args);
    } catch {
      setIsJsonValid(false);
    }
  }, [bodyJson, method]);

  // Compute tokenized parts for inline monochrome rendering
  const getCommandParts = () => {
    const parts: { raw: string; type: "method" | "path" | "header" | "body" }[] = [];

    // 1. Method
    parts.push({ raw: method, type: "method" });

    // 2. Path (or URL)
    parts.push({ raw: path, type: "path" });

    // 3. Headers
    const headers = getParsedHeaders();
    headers.forEach((h) => {
      const escapedVal = h.val.includes(" ") ? `"${h.val}"` : h.val;
      parts.push({ raw: `${h.key}:${escapedVal}`, type: "header" });
    });

    // 4. Body (For POST/PUT/etc)
    if (method === "POST" || method === "PUT") {
      parsedBodyArgs.forEach((arg) => {
        const symbol = arg.isJson ? ":=" : "=";
        parts.push({ raw: `${arg.key}${symbol}${arg.val}`, type: "body" });
      });
    }

    return parts;
  };

  const getFullCommandText = () => {
    return getCommandParts()
      .map((p) => p.raw)
      .join(" ");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullCommandText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="w-full flex flex-col gap-6 py-4">
      {/* Headings */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-wide">
          Build your rqsh request
        </h2>
        <p className="text-xs md:text-sm text-zinc-650 dark:text-zinc-400">
          Learn the CLI's intuitive syntax. Play with fields below to instantly generate a command.
        </p>
      </div>

      {/* Spacious, unconstrained form layout */}
      <div className="w-full flex flex-col gap-6 md:gap-8">

        {/* Method & Path Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
              Method
            </span>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-magenta appearance-none cursor-pointer border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              style={{
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 10px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px 16px',
                paddingRight: '2.5rem',
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="md:col-span-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
              Endpoint Path
            </span>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/posts?limit=10"
              className="w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-magenta border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Headers Area */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
            Headers (One per line, e.g. Name: Value)
          </span>
          <textarea
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder="Content-Type: application/json"
            rows={3}
            className="w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-magenta resize-y min-h-[80px] custom-scrollbar border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
          />
        </div>

        {/* JSON Request Body (Only visible for POST/PUT) */}
        {(method === "POST" || method === "PUT") && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">
                JSON Body
              </span>
              {!isJsonValid && (
                <span className="text-[9px] text-red-500 font-bold tracking-wide">
                  Invalid JSON
                </span>
              )}
            </div>
            <textarea
              value={bodyJson}
              onChange={(e) => setBodyJson(e.target.value)}
              placeholder='{ "title": "New Post" }'
              rows={5}
              className="w-full px-4 py-3 border rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-magenta resize-y min-h-[100px] custom-scrollbar border-zinc-500 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
            />
          </div>
        )}

        {/* Output Box */}
        <div className="flex flex-col gap-2 w-full overflow-hidden mt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-650 dark:text-zinc-500">
            Generated CLI Command
          </span>

          <div
            className="p-5 rounded-2xl border relative font-mono text-xs md:text-sm min-h-[70px] flex items-center justify-between group transition-all select-all border-zinc-500 bg-[#bebebe] hover:border-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            {/* Plain Command String - Black in light mode, White in dark mode. No variations. */}
            <div className="flex flex-row items-center gap-3 overflow-x-auto whitespace-nowrap custom-scrollbar pr-10 py-1 w-full select-all text-black dark:text-white">
              {getCommandParts().map((part, idx) => {
                const isMethod = part.type === "method";
                const isPath = part.type === "path";
                return (
                  <span
                    key={idx}
                    className={`${isMethod ? "font-bold" : isPath ? "font-semibold" : "font-medium"}`}
                  >
                    {part.raw}
                  </span>
                );
              })}
            </div>

            <button
              onClick={handleCopy}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded transition-all cursor-pointer z-10 hover:bg-zinc-300 text-zinc-650 hover:text-magenta dark:hover:bg-zinc-900 dark:text-zinc-400 dark:hover:text-magenta"
              aria-label="Copy Command"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Spacious documentation link as an organic blob button */}
        <div className="w-full flex justify-center md:justify-start mt-4">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center justify-center gap-2.5 bg-magenta text-black font-bold px-8 py-4 rounded-[12px_36px_15px_30px_/_24px_12px_30px_16px] hover:-rotate-[1deg] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 select-none cursor-pointer text-sm shadow-sm"
          >
            <span>Visit docs for more</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
