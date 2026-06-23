import { useState, useEffect } from "react";
import clipboard from "clipboardy";
import { executeRequest } from "../core/executeRequest.js";
import { parseReplCommand } from "../utils/parseReplCommand.js";
import { prettyBody } from "../utils/response.js";
import { SPINNER_FRAMES } from "../utils/animations.js";
import { makeField, type TextField } from "../utils/textField.js";

export function usePostCli() {
  // --- REPL State ---
  const [inputValue, setInputValue] = useState<TextField>(makeField(""));
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [baseUrl, setBaseUrl] = useState<string | undefined>(undefined);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "❯ PostCLI — interactive developer HTTP client",
    "Type a request (e.g. GET /posts/1) or type /help for guides.",
    "",
    "  Esc     - Toggle Scroll Mode (j/k to scroll log, c to copy)",
    ""
  ]);

  // --- UI & Scrolling ---
  const [panel, setPanel] = useState<"input" | "log">("input");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lastResponseBody, setLastResponseBody] = useState("");

  // --- Request Loading & Animation ---
  const [loading, setLoading] = useState(false);
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState<"success" | "failure" | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  // --- Auto-calculated Scroll Window ---
  const VIEWPORT_HEIGHT = 16;
  const totalLines = consoleLines.length;

  // Auto-scroll to bottom when new logs are added (if not actively scrolling)
  useEffect(() => {
    if (panel === "input") {
      setScrollOffset(Math.max(0, totalLines - VIEWPORT_HEIGHT));
    }
  }, [consoleLines, panel, totalLines]);

  // Loading spinner ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && !activeAnimation) {
      interval = setInterval(() => {
        setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [loading, activeAnimation]);

  // --- Autocomplete Generator ---
  const getSuggestion = (val: string): string => {
    if (!val.trim()) return "";
    const lower = val.toLowerCase();
    
    // Commands suggestions
    const cmds = ["/set base http://", "/clear", "/help", "/exit", "/quit", "/copy"];
    for (const cmd of cmds) {
      if (cmd.startsWith(lower)) {
        return cmd.slice(val.length);
      }
    }

    // HTTP method suggestions
    const methods = ["GET ", "POST ", "PUT ", "DELETE ", "PATCH ", "HEAD ", "OPTIONS "];
    for (const m of methods) {
      if (m.startsWith(val.toUpperCase())) {
        return m.slice(val.length);
      }
    }

    return "";
  };

  const suggestion = getSuggestion(inputValue.value);

  // --- Animations Ticker ---
  const playAnimation = (success: boolean, onFinish: () => void) => {
    setActiveAnimation(success ? "success" : "failure");
    setAnimationFrame(0);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 3) {
        clearInterval(interval);
        setActiveAnimation(null);
        onFinish();
      } else {
        setAnimationFrame(frame);
      }
    }, 250);
  };

  // --- Executing Commands ---
  const submitCommand = async (commandStr: string) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    // Save to history
    setHistory((h) => [...h, trimmed]);
    setHistoryIndex(-1);
    setConsoleLines((prev) => [...prev, `postcli ❯ ${commandStr}`]);
    setInputValue(makeField(""));

    const parsed = parseReplCommand(commandStr, baseUrl);

    // A. Handle System Commands
    if (parsed.type === "system") {
      const cmd = parsed.systemCmd;
      const args = parsed.systemArgs ?? [];

      if (cmd === "clear") {
        setConsoleLines([]);
      } else if (cmd === "exit" || cmd === "quit") {
        process.exit(0);
      } else if (cmd === "copy") {
        if (lastResponseBody) {
          try {
            await clipboard.write(lastResponseBody);
            setConsoleLines((prev) => [...prev, "✓ Last response body copied to clipboard!", ""]);
          } catch {
            setConsoleLines((prev) => [...prev, "✖ Clipboard copy failed", ""]);
          }
        } else {
          setConsoleLines((prev) => [...prev, "⚠ No response body to copy", ""]);
        }
      } else if (cmd === "help") {
        setConsoleLines((prev) => [
          ...prev,
          "  Keyboard Controls:",
          "    Esc               - Toggle between Edit Mode and Scroll Mode",
          "    j/k (or Up/Down)  - Scroll up/down through history (Scroll Mode only)",
          "    c                 - Copy last response body (Scroll Mode only)",
          "    Tab               - Accept autocomplete suggestion",
          "    Up/Down Arrows    - Traverse command history (Edit Mode only)",
          "",
          "  PostCLI Commands:",
          "    /set base <url>   - Set default base URL (e.g. /set base https://api.github.com)",
          "    /clear            - Clear the console log history",
          "    /copy             - Copy the body of the last successful response",
          "    /exit, /quit      - Close the CLI application",
          "    /help             - View this instructions guide",
          "",
          "  HTTPie Item Syntax:",
          "    GET /users/octocat                 - Default method is GET",
          "    POST /posts title=\"hello\" age:=20   - Send JSON (age:=20 is parsed JSON)",
          "    GET /posts limit=10                - Query parameter",
          "    GET /users/octocat User-Agent:CLI  - Custom request Header",
          ""
        ]);
      } else if (cmd === "set") {
        const sub = args[0]?.toLowerCase();
        const value = args[1];
        if (sub === "base" && value) {
          // Normalize base url
          let normalized = value;
          if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            normalized = `http://${normalized}`;
          }
          setBaseUrl(normalized);
          setConsoleLines((prev) => [...prev, `✓  Base URL configured to: ${normalized}`, ""]);
        } else {
          setConsoleLines((prev) => [...prev, "⚠  Usage: /set base <url>", ""]);
        }
      } else {
        setConsoleLines((prev) => [...prev, `⚠  Unknown system command: /${cmd}`, ""]);
      }
      return;
    }

    if (parsed.type === "invalid") {
      setConsoleLines((prev) => [...prev, `⚠  Command Error: ${parsed.error}`, ""]);
      return;
    }

    // B. Handle HTTP Requests
    setLoading(true);
    const logIndex = consoleLines.length + 1; // track index to append response later
    setConsoleLines((prev) => [...prev, `⠋ Sending ${parsed.method} ${parsed.url}...`]);

    const result = await executeRequest({
      method: parsed.method,
      url: parsed.url,
      headers: parsed.headers,
      ...(parsed.body ? { body: parsed.body } : {})
    });

    const isSuccess = !("error" in result) && result.status < 400;

    // Play勝利 or 失敗 animation, then print results
    playAnimation(isSuccess, () => {
      setLoading(false);
      
      // Build HTTPie-style output block
      const responseLog: string[] = [];
      
      // Request Headers
      Object.entries(parsed.headers).forEach(([k, v]) => {
        responseLog.push(`  ${k}: ${v}`);
      });
      responseLog.push("");

      if ("error" in result) {
        responseLog.push(`✖ Request Failed (${result.time}ms)`);
        responseLog.push(`Error: ${result.error}`);
        responseLog.push("");
      } else {
        responseLog.push(`HTTP/1.1 ${result.status} ${result.status < 400 ? "OK" : "Error"} (${result.time}ms)`);
        Object.entries(result.headers).forEach(([k, v]) => {
          responseLog.push(`${k}: ${v}`);
        });
        responseLog.push("");

        // Format body
        const pretty = prettyBody(result.body);
        setLastResponseBody(pretty);
        responseLog.push(...pretty.split("\n"));
        responseLog.push("");
      }

      // Replace the spinner/loading line in consoleLines with the full output
      setConsoleLines((prev) => {
        const copy = [...prev];
        // Remove the "Sending..." line we pushed earlier
        copy.splice(logIndex, 1);
        return [...copy, ...responseLog];
      });
    });
  };

  const copyResponseDirectly = async () => {
    if (!lastResponseBody) return;
    try {
      await clipboard.write(lastResponseBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      setConsoleLines((prev) => [...prev, "✓ Copied response body!", ""]);
    } catch { /* ignore */ }
  };

  return {
    inputValue,
    setInputValue,
    history,
    historyIndex,
    setHistoryIndex,
    baseUrl,
    consoleLines,
    setConsoleLines,
    panel,
    setPanel,
    scrollOffset,
    setScrollOffset,
    copied,
    lastResponseBody,
    loading,
    spinnerFrame,
    activeAnimation,
    animationFrame,
    suggestion,
    totalLines,
    VIEWPORT_HEIGHT,
    submitCommand,
    copyResponseDirectly
  };
}
export type PostCliState = ReturnType<typeof usePostCli>;
