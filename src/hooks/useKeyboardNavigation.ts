import { useInput } from "ink";
import { LEFT_SECTIONS, VIEWPORT_HEIGHT } from "../constants/constants.js";
import { makeField, tfDelete, tfInsert, tfLeft, tfRight } from "../utils/textField.js";
import { useUiState } from "./useUiState.js";
import { commitDraft, copyResponse, cycleMethod, deleteRow, sendRequest } from "../utils/request.js";
// import { totalLines } from "../utils/response.js";
import { useResponseState } from "./useResponseState.js";
import { useRequestState } from "./useRequestState.js";
import { useResponseAction } from "./useResponseAction.js";



export function useKeyboardNavigation({onBack}: { onBack: () => void }){
  
  const uiState = useUiState()
  const responseState = useResponseState()
  const requestState = useRequestState()
  const { totalLines } = useResponseAction()
  const isEditing = uiState.editMode !== "none";
  
  useInput((input, key) => {

    if (isEditing) {
      if (key.escape) {
        uiState.setDraftKey(makeField()); uiState.setDraftValue(makeField()); uiState.setEditMode("none");
        return;
      }
      if (key.return) {
        if (uiState.editMode === "url" || uiState.editMode === "body") { uiState.setEditMode("none"); return; }
        if (uiState.editMode === "kv-key")   { uiState.setEditMode("kv-value"); return; }
        if (uiState.editMode === "kv-value") { commitDraft(uiState.leftSec === "params" ? "params" : "req-headers"); return; }
        return;
      }
      if (key.leftArrow) {
        if (uiState.editMode === "url")           requestState.setUrlField(tfLeft(requestState.urlField));
        else if (uiState.editMode === "body")     requestState.setBodyField(tfLeft(requestState.bodyField));
        else if (uiState.editMode === "kv-key")   uiState.setDraftKey(tfLeft(uiState.draftKey));
        else if (uiState.editMode === "kv-value") uiState.setDraftValue(tfLeft(uiState.draftValue));
        return;
      }
      if (key.rightArrow) {
        if (uiState.editMode === "url")           requestState.setUrlField(tfRight(requestState.urlField));
        else if (uiState.editMode === "body")     requestState.setBodyField(tfRight(requestState.bodyField));
        else if (uiState.editMode === "kv-key")   uiState.setDraftKey(tfRight(uiState.draftKey));
        else if (uiState.editMode === "kv-value") uiState.setDraftValue(tfRight(uiState.draftValue));
        return;
      }
      if (key.backspace || key.delete) {
        if (uiState.editMode === "url")           requestState.setUrlField(tfDelete(requestState.urlField));
        else if (uiState.editMode === "body")     requestState.setBodyField(tfDelete(requestState.bodyField));
        else if (uiState.editMode === "kv-key")   uiState.setDraftKey(tfDelete(uiState.draftKey));
        else if (uiState.editMode === "kv-value") uiState.setDraftValue(tfDelete(uiState.draftValue));
        return;
      }
      if (input) {
        if (uiState.editMode === "url")           requestState.setUrlField(tfInsert(requestState.urlField, input));
        else if (uiState.editMode === "body")     requestState.setBodyField(tfInsert(requestState.bodyField, input));
        else if (uiState.editMode === "kv-key")   uiState.setDraftKey(tfInsert(uiState.draftKey, input));
        else if (uiState.editMode === "kv-value") uiState.setDraftValue(tfInsert(uiState.draftValue, input));
      }
      return;
    }

    // ── Global ──
    if (input === "q" || input === "Q") { onBack(); return; }
    if (input === "e" || input === "E") { void sendRequest(); return; }
    if (input === "c" || input === "C") { void copyResponse(); return; }

    // ── Tab: switch panel focus ──
    if (key.tab) {
      uiState.setPanel(p => p === "left" ? "right" : "left");
      return;
    }

    // ── LEFT panel ──────────────────────────────────────────────────────────
    if (uiState.panel === "left") {

      // j / down  →  move section down (or KV row down)
      if (input === "j" || key.downArrow) {
        if (uiState.leftSec === "params" && uiState.kvCursor < requestState.params.length - 1) {
          uiState.setKvCursor(c => c + 1); return;
        }
        if (uiState.leftSec === "req-headers" && uiState.kvCursor < requestState.reqHeaders.length - 1) {
          uiState.setKvCursor(c => c + 1); return;
        }
        const i = LEFT_SECTIONS.indexOf(uiState.leftSec);
        if (i < LEFT_SECTIONS.length - 1) {
          uiState.setLeftSec(LEFT_SECTIONS[i + 1]!);
          uiState.setKvCursor(0);
        }
        return;
      }

      // k / up  →  move section up (or KV row up)
      if (input === "k" || key.upArrow) {
        if ((uiState.leftSec === "params" || uiState.leftSec === "req-headers") && uiState.kvCursor > 0) {
          uiState.setKvCursor(c => c - 1); return;
        }
        const i = LEFT_SECTIONS.indexOf(uiState.leftSec);
        if (i > 0) {
          uiState.setLeftSec(LEFT_SECTIONS[i - 1]!);
          uiState.setKvCursor(0);
        }
        return;
      }

      // section-specific
      if (uiState.leftSec === "url-method") {
        if (input === "i")           uiState.setEditMode("url");
        if (key.leftArrow)           cycleMethod(-1);
        if (key.rightArrow)          cycleMethod(1);
      }

      if (uiState.leftSec === "params") {
        if (input === "a" || input === "A") {
          uiState.setKvCursor(requestState.params.length);
          uiState.setDraftKey(makeField()); uiState.setDraftValue(makeField());
          uiState.setEditMode("kv-key");
        }
        if (input === "d" || input === "D") deleteRow("params");
      }

      if (uiState.leftSec === "req-headers") {
        if (input === "a" || input === "A") {
          uiState.setKvCursor(requestState.reqHeaders.length);
          uiState.setDraftKey(makeField()); uiState.setDraftValue(makeField());
          uiState.setEditMode("kv-key");
        }
        if (input === "d" || input === "D") deleteRow("req-headers");
      }

      if (uiState.leftSec === "body") {
        if (input === "i") uiState.setEditMode("body");
      }
    }

    // ── RIGHT panel ─────────────────────────────────────────────────────────
    if (uiState.panel === "right") {

      // h/l or left/right  →  switch response tab
      if (input === "h" || key.leftArrow)  { uiState.setRightTab("body");    responseState.setRespScroll(0); return; }
      if (input === "l" || key.rightArrow) { uiState.setRightTab("headers"); responseState.setRespScroll(0); return; }

      // j/k  →  scroll response viewport
      if (input === "j" || key.downArrow) {
        responseState.setRespScroll(s => Math.min(s + 1, Math.max(0, totalLines - VIEWPORT_HEIGHT)));
        return;
      }
      if (input === "k" || key.upArrow) {
        responseState.setRespScroll(s => Math.max(0, s - 1));
        return;
      }

      // G  →  jump to end, gg  →  jump to top
      if (input === "G") {
        responseState.setRespScroll(Math.max(0, totalLines - VIEWPORT_HEIGHT));
        return;
      }
      if (input === "g") {
        responseState.setRespScroll(0);
        return;
      }
    }
  });
}

