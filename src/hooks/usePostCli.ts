import { useState, useEffect } from "react";
import clipboard from "clipboardy";
import { executeRequest } from "../core/executeRequest.js";
import { parseReplCommand } from "../utils/parseReplCommand.js";
import { prettyBody, byteSize } from "../utils/response.js";
import { SPINNER_FRAMES } from "../utils/animations.js";
import { makeField, type TextField } from "../utils/textField.js";

export function usePostCli() {
  // --- REPL State ---
  const [inputValue, setInputValue] = useState<TextField>(makeField(""));
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [baseUrl, setBaseUrl] = useState<string | undefined>(undefined);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "██████╗  ██████╗ ███████╗████████╗ ██████╗██╗     ██╗",
    "██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔════╝██║     ██║",
    "██████╔╝██║   ██║███████╗   ██║   ██║     ██║     ██║",
    "██╔═══╝ ██║   ██║╚════██║   ██║   ██║     ██║     ██║",
    "██║     ╚██████╔╝███████║   ██║   ╚██████╗███████╗██║",
    "╚═╝      ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝╚══════╝╚═╝",
    "",
    "Type a request (e.g. GET /posts/1) or type /help for guides.",
    ""
  ]);

  // --- UI & Scrolling ---
  const [panel, setPanel] = useState<"input" | "log">("input");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [lastResponseBody, setLastResponseBody] = useState("");

  // --- Inspector State ---
  const [viewingResponse, setViewingResponse] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<"body" | "headers">("body");
  const [inspectorScroll, setInspectorScroll] = useState(0);
  const [lastResponseHeaders, setLastResponseHeaders] = useState<Record<string, string>>({});
  const [lastResponseStatus, setLastResponseStatus] = useState("");
  const [lastResponseTime, setLastResponseTime] = useState(0);
  const [lastResponseSize, setLastResponseSize] = useState("");
  const [inspectorFrame, setInspectorFrame] = useState(0);

  // --- Request Loading State ---
  const [loading, setLoading] = useState(false);
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  // --- Dynamic Terminal Dimensions ---
  const [terminalRows, setTerminalRows] = useState(process.stdout?.rows || 24);

  useEffect(() => {
    if (!process.stdout) return;
    const handleResize = () => {
      setTerminalRows(process.stdout.rows || 24);
    };
    process.stdout.on("resize", handleResize);
    return () => {
      process.stdout.off("resize", handleResize);
    };
  }, []);

  const VIEWPORT_HEIGHT = Math.max(5, terminalRows - 10);
  const INSPECTOR_HEIGHT = Math.max(8, terminalRows - 9);
  const totalLines = consoleLines.length;

  // Auto-scroll to bottom when new logs are added (if not actively scrolling/resizing)
  useEffect(() => {
    if (panel === "input") {
      setScrollOffset(Math.max(0, totalLines - VIEWPORT_HEIGHT));
    }
  }, [consoleLines, panel, totalLines, VIEWPORT_HEIGHT]);

  // Loading spinner ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setSpinnerFrame((f) => (f + 1) % SPINNER_FRAMES.length);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Inspector Mascot frame ticker loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (viewingResponse && !loading) {
      interval = setInterval(() => {
        setInspectorFrame((f) => (f + 1) % 3);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [viewingResponse, loading]);

  // --- Autocomplete Generator ---
  const getSuggestion = (val: string): string => {
    if (!val.trim()) return "";
    const lower = val.toLowerCase();
    
    // Commands suggestions
    const cmds = ["/set base", "/clear", "/help", "/exit", "/quit", "/copy"];
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
          "  Controls: [Esc] Edit/Scroll mode | [Tab] Autocomplete | [v] View response | [c] Copy body",
          "  Commands: /set base <url> | /clear | /copy | /help | /exit",
          "  HTTPie Syntax examples:",
          "    GET /posts limit=10                  (Query param)",
          "    POST /posts title=\"hello\" active:=true (JSON payload)",
          "    GET /users Authorization:Bearer      (Request Header)",
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
    setConsoleLines((prev) => [...prev, `Sending ${parsed.method} ${parsed.url}...`]);

    const result = await executeRequest({
      method: parsed.method,
      url: parsed.url,
      headers: parsed.headers,
      ...(parsed.body ? { body: parsed.body } : {})
    });

    setLoading(false);

    if ("error" in result) {
      setConsoleLines((prev) => {
        const copy = [...prev];
        copy.splice(logIndex, 1);
        return [
          ...copy,
          `✖  ${parsed.method} ${parsed.url} failed: ${result.error} (${result.time}ms)`,
          ""
        ];
      });

      // Set failed details for inspector
      setLastResponseBody(`Error: ${result.error}`);
      setLastResponseHeaders({});
      setLastResponseStatus("Error");
      setLastResponseTime(result.time);
      setLastResponseSize("—");
      
      // Open inspector to show failure
      setViewingResponse(true);
      setInspectorTab("body");
      setInspectorScroll(0);
    } else {
      const pretty = prettyBody(result.body);
      const sizeStr = byteSize(result.body);
      const statusText = `${result.status} ${result.status < 400 ? "OK" : "Error"}`;
      
      setConsoleLines((prev) => {
        const copy = [...prev];
        copy.splice(logIndex, 1);
        return [
          ...copy,
          `✔  ${result.status} ${result.status < 400 ? "OK" : "Error"}  •  ${result.time}ms  •  ${sizeStr}  (Press v to view details)`,
          ""
        ];
      });

      // Save response details
      setLastResponseBody(pretty);
      setLastResponseHeaders(result.headers);
      setLastResponseStatus(statusText);
      setLastResponseTime(result.time);
      setLastResponseSize(sizeStr);
      
      // Auto-open response inspector!
      setViewingResponse(true);
      setInspectorTab("body");
      setInspectorScroll(0);
    }
  };

  const copyResponseDirectly = async (type: "body" | "headers" = "body") => {
    try {
      if (type === "body") {
        if (!lastResponseBody) return;
        await clipboard.write(lastResponseBody);
        setCopied("body");
        setTimeout(() => setCopied(null), 1500);
      } else {
        if (!lastResponseHeaders || Object.keys(lastResponseHeaders).length === 0) return;
        const formatted = Object.entries(lastResponseHeaders)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
        await clipboard.write(formatted);
        setCopied("headers");
        setTimeout(() => setCopied(null), 1500);
      }
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
    suggestion,
    totalLines,
    VIEWPORT_HEIGHT,
    INSPECTOR_HEIGHT,
    terminalRows,
    submitCommand,
    copyResponseDirectly,

    // Inspector
    viewingResponse,
    setViewingResponse,
    inspectorTab,
    setInspectorTab,
    inspectorScroll,
    setInspectorScroll,
    lastResponseHeaders,
    lastResponseStatus,
    lastResponseTime,
    lastResponseSize,
    inspectorFrame
  };
}
export type PostCliState = ReturnType<typeof usePostCli>;
