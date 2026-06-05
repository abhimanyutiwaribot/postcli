import { useState } from "react";
import type { EditMode, LeftSection, PanelFocus, RightTab } from "../types/ui.js";
import { makeField, type TextField } from "../utils/textField.js";

export function useUiState(){
  const [panel, setPanel]           = useState<PanelFocus>("left");
  const [leftSec, setLeftSec]       = useState<LeftSection>("url-method");
  const [rightTab, setRightTab]     = useState<RightTab>("body");
  const [editMode, setEditMode]     = useState<EditMode>("none");
  const [kvCursor, setKvCursor]     = useState(0);
  const [draftKey, setDraftKey]     = useState<TextField>(makeField());
  const [draftValue, setDraftValue] = useState<TextField>(makeField());

  return  {
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
    setDraftValue
  }
}