import { useInput } from "ink";
import { useRef } from "react";
import { makeField, tfDelete, tfInsert, tfLeft, tfRight } from "../utils/textField.js";
import type { usePostCli } from "./usePostCli.js";

interface KeyboardNavigationProps {
  state: ReturnType<typeof usePostCli>;
}

export function useKeyboardNavigation({ state: propState }: KeyboardNavigationProps) {
  const stateRef = useRef(propState);
  stateRef.current = propState;

  useInput((input, key) => {
    const state = stateRef.current;
    const { 
      panel, 
      inputValue, 
      suggestion, 
      history, 
      historyIndex, 
      totalLines, 
      VIEWPORT_HEIGHT,
      viewingResponse,
      inspectorTab,
      lastResponseBody,
      lastResponseHeaders
    } = state;

    // ── PANEL: RESPONSE INSPECTOR MODE (OVERLAY) ──
    if (viewingResponse) {
      // Close Inspector (Esc or q)
      if (key.escape || input === "q" || input === "Q") {
        state.setViewingResponse(false);
        return;
      }

      // Toggle Tabs (Tab or h/l or arrow keys)
      if (key.tab || input === "h" || input === "l" || key.leftArrow || key.rightArrow) {
        state.setInspectorTab((t) => (t === "body" ? "headers" : "body"));
        state.setInspectorScroll(0); // Reset scroll position on tab toggle
        return;
      }

      const totalInspectorLines = inspectorTab === "body"
        ? lastResponseBody.split("\n").length
        : Object.keys(lastResponseHeaders).length;

      const { INSPECTOR_HEIGHT } = state;

      // Scroll Down (j or down arrow)
      if (input === "j" || key.downArrow) {
        state.setInspectorScroll((s) =>
          Math.min(s + 1, Math.max(0, totalInspectorLines - INSPECTOR_HEIGHT))
        );
        return;
      }

      // Scroll Up (k or up arrow)
      if (input === "k" || key.upArrow) {
        state.setInspectorScroll((s) => Math.max(0, s - 1));
        return;
      }

      // Vim scroll keys: gg (top), G (bottom)
      if (input === "g") {
        state.setInspectorScroll(0);
        return;
      }

      if (input === "G") {
        state.setInspectorScroll(Math.max(0, totalInspectorLines - INSPECTOR_HEIGHT));
        return;
      }

      // Copy response body
      if (input === "c" || input === "C") {
        void state.copyResponseDirectly(inspectorTab);
        return;
      }

      return;
    }

    // ── Global System Controls ──
    if (input === "q" || input === "Q") {
      if (panel === "log") {
        process.exit(0);
      }
    }

    // Toggle Response Inspector (v / V)
    if (input === "v" || input === "V") {
      if (lastResponseBody) {
        state.setViewingResponse(true);
        state.setInspectorTab("body");
        state.setInspectorScroll(0);
      }
      return;
    }

    // Toggle between input prompt and scrollable log console
    if (key.escape) {
      state.setPanel((p) => (p === "input" ? "log" : "input"));
      return;
    }

    // ── PANEL: INPUT PROMPT MODE ──
    if (panel === "input") {
      if (key.return) {
        if (inputValue.value.trim()) {
          void state.submitCommand(inputValue.value);
        }
        return;
      }

      if (key.tab) {
        if (suggestion) {
          state.setInputValue(makeField(inputValue.value + suggestion));
        }
        return;
      }

      if (key.backspace || key.delete) {
        state.setInputValue(tfDelete(inputValue));
        return;
      }

      if (key.leftArrow) {
        state.setInputValue(tfLeft(inputValue));
        return;
      }

      if (key.rightArrow) {
        state.setInputValue(tfRight(inputValue));
        return;
      }

      // Command History Navigation (Up / Down)
      if (key.upArrow) {
        if (history.length === 0) return;
        
        let nextIndex = historyIndex;
        if (historyIndex === -1) {
          nextIndex = history.length - 1;
        } else {
          nextIndex = Math.max(0, historyIndex - 1);
        }
        state.setHistoryIndex(nextIndex);
        state.setInputValue(makeField(history[nextIndex]!));
        return;
      }

      if (key.downArrow) {
        if (historyIndex === -1) return;
        
        if (historyIndex === history.length - 1) {
          state.setHistoryIndex(-1);
          state.setInputValue(makeField(""));
        } else {
          const nextIndex = historyIndex + 1;
          state.setHistoryIndex(nextIndex);
          state.setInputValue(makeField(history[nextIndex]!));
        }
        return;
      }

      // Standard character entry
      if (input && !key.ctrl && !key.meta) {
        const code = input.charCodeAt(0);
        if (code >= 32 && code !== 127) {
          state.setInputValue(tfInsert(inputValue, input));
        }
      }
      return;
    }

    // ── PANEL: LOG SCROLLBACK MODE ──
    if (panel === "log") {
      // Toggle back to input on return or 'i'
      if (key.return || input === "i" || input === "I") {
        state.setPanel("input");
        return;
      }

      // Scroll viewport down (j / down)
      if (input === "j" || key.downArrow) {
        state.setScrollOffset((s) => Math.min(s + 1, Math.max(0, totalLines - VIEWPORT_HEIGHT)));
        return;
      }

      // Scroll viewport up (k / up)
      if (input === "k" || key.upArrow) {
        state.setScrollOffset((s) => Math.max(0, s - 1));
        return;
      }

      // Vim scroll keys: gg (top), G (bottom)
      if (input === "g") {
        state.setScrollOffset(0);
        return;
      }

      if (input === "G") {
        state.setScrollOffset(Math.max(0, totalLines - VIEWPORT_HEIGHT));
        return;
      }

      // Copy response body
      if (input === "c" || input === "C") {
        void state.copyResponseDirectly();
        return;
      }
    }
  });
}
export type KeyboardNavigationState = ReturnType<typeof useKeyboardNavigation>;
