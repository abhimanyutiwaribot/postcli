import { useState } from "react";
import clipboard from "clipboardy";
import { METHODS, VIEWPORT_HEIGHT } from "../constants/constants.js";
import { executeRequest } from "../core/executeRequest.js";
import type { KVPair, Method, ResponseData } from "../types/request.js";
import type { EditMode, LeftSection, PanelFocus, RightTab } from "../types/ui.js";
import { buildUrl } from "../utils/request.js";
import { prettyBody } from "../utils/response.js";
import { makeField, type TextField } from "../utils/textField.js";

export function usePostCli() {
  // --- Request State ---
  const [method, setMethod] = useState<Method>("GET");
  const [urlField, setUrlField] = useState<TextField>(makeField("http://example.com/"));
  const [params, setParams] = useState<KVPair[]>([]);
  const [reqHeaders, setReqHeaders] = useState<KVPair[]>([]);
  const [bodyField, setBodyField] = useState<TextField>(makeField(""));

  // --- Response State ---
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [respScroll, setRespScroll] = useState(0);
  const [copied, setCopied] = useState(false);

  // --- UI State ---
  const [panel, setPanel]           = useState<PanelFocus>("left");
  const [leftSec, setLeftSec]       = useState<LeftSection>("url-method");
  const [rightTab, setRightTab]     = useState<RightTab>("body");
  const [editMode, setEditMode]     = useState<EditMode>("none");
  const [kvCursor, setKvCursor]     = useState(0);
  const [draftKey, setDraftKey]     = useState<TextField>(makeField());
  const [draftValue, setDraftValue] = useState<TextField>(makeField());

  // --- Auto-calculated Fields ---
  const autoHeaders: KVPair[] = [
    { key: "Accept", value: "application/json" },
    ...(!["GET", "HEAD"].includes(method) && bodyField.value.trim()
      ? [{ key: "Content-Type", value: "application/json" }]
      : []),
  ];

  const responseLines: string[] = (() => {
    if (!response || "error" in response) return [];
    if (rightTab === "body") return prettyBody(response.body).split("\n");
    return Object.entries(response.headers).map(([k, v]) => `${k}: ${v}`);
  })();

  const totalLines = responseLines.length;
  const visibleLines = responseLines.slice(respScroll, respScroll + VIEWPORT_HEIGHT);
  // Pad response lines to prevent terminal layout shifts
  const paddedLines = [
    ...visibleLines,
    ...Array(Math.max(0, VIEWPORT_HEIGHT - visibleLines.length)).fill(""),
  ];

  // --- Actions ---
  const cycleMethod = (dir: 1 | -1) => {
    const i = METHODS.indexOf(method);
    setMethod(METHODS[(i + dir + METHODS.length) % METHODS.length]!);
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    setRespScroll(0);

    const builtHeaders: Record<string, string> = {};
    autoHeaders.forEach(h => { builtHeaders[h.key] = h.value; });
    reqHeaders.forEach(h => { if (h.key.trim()) builtHeaders[h.key] = h.value; });

    const result = await executeRequest({
      method,
      url: buildUrl(urlField.value, params),
      headers: builtHeaders,
      ...(!["GET", "HEAD"].includes(method) && bodyField.value.trim()
        ? { body: bodyField.value }
        : {}),
    });

    setResponse(result);
    setLoading(false);
  };

  const commitDraft = (target: "params" | "req-headers") => {
    if (draftKey.value.trim()) {
      const entry: KVPair = { key: draftKey.value, value: draftValue.value };
      if (target === "params") setParams(p => [...p, entry]);
      else setReqHeaders(h => [...h, entry]);
    }
    setDraftKey(makeField());
    setDraftValue(makeField());
    setEditMode("none");
  };

  const deleteRow = (target: "params" | "req-headers") => {
    if (target === "params") {
      if (!params.length) return;
      setParams(p => p.filter((_, i) => i !== kvCursor));
    } else {
      if (!reqHeaders.length) return;
      setReqHeaders(h => h.filter((_, i) => i !== kvCursor));
    }
    setKvCursor(c => Math.max(0, c - 1));
  };

  const copyResponse = async () => {
    if (!response || "error" in response) return;
    try {
      await clipboard.write(prettyBody(response.body));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return {
    // State
    method,
    setMethod,
    urlField,
    setUrlField,
    params,
    setParams,
    reqHeaders,
    setReqHeaders,
    bodyField,
    setBodyField,
    loading,
    setLoading,
    response,
    setResponse,
    respScroll,
    setRespScroll,
    copied,
    setCopied,
    panel,
    setPanel,
    leftSec,
    setLeftSec,
    rightTab,
    setRightTab,
    editMode,
    setEditMode,
    kvCursor,
    setKvCursor,
    draftKey,
    setDraftKey,
    draftValue,
    setDraftValue,
    
    // Auto-calculated
    autoHeaders,
    responseLines,
    totalLines,
    visibleLines,
    paddedLines,

    // Actions
    cycleMethod,
    sendRequest,
    commitDraft,
    deleteRow,
    copyResponse,
  };
}
