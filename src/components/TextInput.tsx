import { Text } from "ink";
import type { TextField } from "../utils/textField.js";

export default function TextInput({ field, active, width }: { field: TextField; active: boolean; width?: number }) {
  const { value, cursor } = field;
  // Truncate display to width if provided (prevent layout blowing up)
  const maxShow  = width ? width - 1 : 9999;
  // Show a window around the cursor
  const winStart = Math.max(0, cursor - maxShow + 1);
  const display  = value.slice(winStart);
  const relCursor = cursor - winStart;

  const before    = display.slice(0, relCursor);
  const atCursor  = display[relCursor] ?? " ";
  const after     = display.slice(relCursor + 1);

  return (
    <Text>
      <Text color={active ? "white" : "gray"}>{before}</Text>
      {active
        ? <Text backgroundColor="cyan" color="black">{atCursor}</Text>
        : <Text color="gray">{value[cursor] ?? ""}</Text>}
      <Text color={active ? "white" : "gray"}>{after}</Text>
    </Text>
  );
}