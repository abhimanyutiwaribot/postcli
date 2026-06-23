import { useInput } from "ink";
import { LEFT_SECTIONS, VIEWPORT_HEIGHT } from "../constants/constants.js";
import { makeField, tfDelete, tfInsert, tfLeft, tfRight } from "../utils/textField.js";
import type { usePostCli } from "./usePostCli.js";

interface KeyboardNavigationProps {
  state: ReturnType<typeof usePostCli>;
}

export function useKeyboardNavigation({ state }: KeyboardNavigationProps) {
  const { totalLines } = state;
  const isEditing = state.editMode !== "none";

  useInput((input, key) => {
    // ── Editing Mode Controls ──
    if (isEditing) {
      if (key.escape) {
        state.setDraftKey(makeField());
        state.setDraftValue(makeField());
        state.setEditMode("none");
        return;
      }
      if (key.return) {
        if (state.editMode === "url" || state.editMode === "body") {
          state.setEditMode("none");
          return;
        }
        if (state.editMode === "kv-key") {
          state.setEditMode("kv-value");
          return;
        }
        if (state.editMode === "kv-value") {
          state.commitDraft(state.leftSec === "params" ? "params" : "req-headers");
          return;
        }
        return;
      }
      if (key.leftArrow) {
        if (state.editMode === "url")           state.setUrlField(tfLeft(state.urlField));
        else if (state.editMode === "body")     state.setBodyField(tfLeft(state.bodyField));
        else if (state.editMode === "kv-key")   state.setDraftKey(tfLeft(state.draftKey));
        else if (state.editMode === "kv-value") state.setDraftValue(tfLeft(state.draftValue));
        return;
      }
      if (key.rightArrow) {
        if (state.editMode === "url")           state.setUrlField(tfRight(state.urlField));
        else if (state.editMode === "body")     state.setBodyField(tfRight(state.bodyField));
        else if (state.editMode === "kv-key")   state.setDraftKey(tfRight(state.draftKey));
        else if (state.editMode === "kv-value") state.setDraftValue(tfRight(state.draftValue));
        return;
      }
      if (key.backspace || key.delete) {
        if (state.editMode === "url")           state.setUrlField(tfDelete(state.urlField));
        else if (state.editMode === "body")     state.setBodyField(tfDelete(state.bodyField));
        else if (state.editMode === "kv-key")   state.setDraftKey(tfDelete(state.draftKey));
        else if (state.editMode === "kv-value") state.setDraftValue(tfDelete(state.draftValue));
        return;
      }
      if (input) {
        if (state.editMode === "url")           state.setUrlField(tfInsert(state.urlField, input));
        else if (state.editMode === "body")     state.setBodyField(tfInsert(state.bodyField, input));
        else if (state.editMode === "kv-key")   state.setDraftKey(tfInsert(state.draftKey, input));
        else if (state.editMode === "kv-value") state.setDraftValue(tfInsert(state.draftValue, input));
      }
      return;
    }

    // ── Global Actions (Command Mode) ──
    if (input === "q" || input === "Q") {
      process.exit(0);
    }
    if (input === "e" || input === "E") {
      void state.sendRequest();
      return;
    }
    if (input === "c" || input === "C") {
      void state.copyResponse();
      return;
    }

    // ── Tab: Toggle focus between Panels ──
    if (key.tab) {
      state.setPanel(p => p === "left" ? "right" : "left");
      return;
    }

    // ── Left Panel Keyboard Handling ──
    if (state.panel === "left") {
      // j / down  →  Move cursor down sections or table rows
      if (input === "j" || key.downArrow) {
        if (state.leftSec === "params" && state.kvCursor < state.params.length - 1) {
          state.setKvCursor(c => c + 1);
          return;
        }
        if (state.leftSec === "req-headers" && state.kvCursor < state.reqHeaders.length - 1) {
          state.setKvCursor(c => c + 1);
          return;
        }
        const i = LEFT_SECTIONS.indexOf(state.leftSec);
        if (i < LEFT_SECTIONS.length - 1) {
          state.setLeftSec(LEFT_SECTIONS[i + 1]!);
          state.setKvCursor(0);
        }
        return;
      }

      // k / up  →  Move cursor up sections or table rows
      if (input === "k" || key.upArrow) {
        if ((state.leftSec === "params" || state.leftSec === "req-headers") && state.kvCursor > 0) {
          state.setKvCursor(c => c - 1);
          return;
        }
        const i = LEFT_SECTIONS.indexOf(state.leftSec);
        if (i > 0) {
          state.setLeftSec(LEFT_SECTIONS[i - 1]!);
          state.setKvCursor(0);
        }
        return;
      }

      // Section-specific inputs
      if (state.leftSec === "url-method") {
        if (input === "i") state.setEditMode("url");
        if (key.leftArrow) state.cycleMethod(-1);
        if (key.rightArrow) state.cycleMethod(1);
      }

      if (state.leftSec === "params") {
        if (input === "a" || input === "A") {
          state.setKvCursor(state.params.length);
          state.setDraftKey(makeField());
          state.setDraftValue(makeField());
          state.setEditMode("kv-key");
        }
        if (input === "d" || input === "D") {
          state.deleteRow("params");
        }
      }

      if (state.leftSec === "req-headers") {
        if (input === "a" || input === "A") {
          state.setKvCursor(state.reqHeaders.length);
          state.setDraftKey(makeField());
          state.setDraftValue(makeField());
          state.setEditMode("kv-key");
        }
        if (input === "d" || input === "D") {
          state.deleteRow("req-headers");
        }
      }

      if (state.leftSec === "body") {
        if (input === "i") state.setEditMode("body");
      }
    }

    // ── Right Panel Keyboard Handling ──
    if (state.panel === "right") {
      // h/l or left/right  →  Switch response tab
      if (input === "h" || key.leftArrow) {
        state.setRightTab("body");
        state.setRespScroll(0);
        return;
      }
      if (input === "l" || key.rightArrow) {
        state.setRightTab("headers");
        state.setRespScroll(0);
        return;
      }

      // j/k or up/down  →  Scroll viewport
      if (input === "j" || key.downArrow) {
        state.setRespScroll(s => Math.min(s + 1, Math.max(0, totalLines - VIEWPORT_HEIGHT)));
        return;
      }
      if (input === "k" || key.upArrow) {
        state.setRespScroll(s => Math.max(0, s - 1));
        return;
      }

      // Vim scroll helpers: G (end), gg (top)
      if (input === "G") {
        state.setRespScroll(Math.max(0, totalLines - VIEWPORT_HEIGHT));
        return;
      }
      if (input === "g") {
        state.setRespScroll(0);
        return;
      }
    }
  });
}
