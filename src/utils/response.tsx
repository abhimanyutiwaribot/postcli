import React from "react";
import { Text } from "ink";

export function statusColor(s: number) {
  if (s >= 500) return "red";
  if (s >= 400) return "yellow";
  if (s >= 300) return "cyan";
  return "green";
}

export function prettyBody(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}

export function byteSize(s: string): string {
  const b = new TextEncoder().encode(s).length;
  return b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`;
}

// Token-based highlighting for pretty-printed JSON lines
export function highlightJsonLine(line: string): React.ReactNode {
  // Match key-value: ^(\s*)("[^"]+")(\s*:\s*)(.*)$
  const keyMatch = line.match(/^(\s*)("[^"]+")(\s*:\s*)(.*)$/);
  if (keyMatch) {
    const [, indent, key, colon, rest] = keyMatch;
    if (!indent || !key || !colon || !rest) return <Text>{line}</Text>;

    // Match simple values (strings, numbers, booleans, null) + optional comma
    const valueMatch = rest.match(/^("[^"]*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(,?\s*)$/);
    if (valueMatch) {
      const [, val, trailing = ""] = valueMatch;
      if (!val) return <Text>{line}</Text>;

      let valColor = "white";
      if (val.startsWith('"')) valColor = "green";
      else if (val === "true" || val === "false") valColor = "yellow";
      else if (val === "null") valColor = "red";
      else valColor = "magenta";

      return (
        <Text>
          <Text>{indent}</Text>
          <Text color="cyan">{key}</Text>
          <Text>{colon}</Text>
          <Text color={valColor}>{val}</Text>
          <Text color="gray">{trailing}</Text>
        </Text>
      );
    } else {
      // Not a simple value line (e.g. key: { or key: [ or multi-line string start)
      const isStringStart = rest.trim().startsWith('"');
      return (
        <Text>
          <Text>{indent}</Text>
          <Text color="cyan">{key}</Text>
          <Text>{colon}</Text>
          <Text color={isStringStart ? "green" : "gray"}>{rest}</Text>
        </Text>
      );
    }
  }

  // Match list values (without keys, e.g. arrays of primitives)
  const plainValMatch = line.match(/^(\s*)("[^"]*"|true|false|null|-?\d+(?:\.\d+)?)(,?\s*)$/);
  if (plainValMatch) {
    const [, indent, val, trailing = ""] = plainValMatch;
    if (indent && val) {
      let valColor = "white";
      if (val.startsWith('"')) valColor = "green";
      else if (val === "true" || val === "false") valColor = "yellow";
      else if (val === "null") valColor = "red";
      else valColor = "magenta";

      return (
        <Text>
          <Text>{indent}</Text>
          <Text color={valColor}>{val}</Text>
          <Text color="gray">{trailing}</Text>
        </Text>
      );
    }
  }

  // Default: color brackets/braces/commas gray, keep others white
  const isBrace = /^[{}[\],:\s]+$/.test(line);
  return <Text color={isBrace ? "gray" : "white"}>{line}</Text>;
}
