import React from "react";
import { Box, Text } from "ink";
import { highlightJsonLine } from "../utils/response.js";
import { SPINNER_FRAMES } from "../utils/animations.js";
import type { RqsState } from "../hooks/useRqsCli.js";

interface ReplConsoleProps {
  state: RqsState;
}

export default function ReplConsole({ state }: ReplConsoleProps) {
  const visibleLines = state.consoleLines.slice(
    state.scrollOffset,
    state.scrollOffset + state.VIEWPORT_HEIGHT
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box paddingX={1} gap={1} marginBottom={0}>
        <Text bold color="magenta">❯ RQS REPL</Text>
        <Text dimColor>—</Text>
        <Text color="gray">interactive HTTP shell console</Text>
      </Box>

      {/* Settings status badges */}
      <Box paddingX={1} marginBottom={1} gap={2}>
        <Text color="gray">
          Base URL: {state.baseUrl ? <Text color="green" bold>{state.baseUrl}</Text> : <Text dimColor>none (use /set base &lt;url&gt;)</Text>}
        </Text>
        {state.lastResponseBody && (
          <Text color="gray">
            Last Response: <Text color="magenta">available</Text> <Text dimColor>(Press v to view details)</Text>
          </Text>
        )}
      </Box>

      {/* Output Console Log */}
      <Box
        flexDirection="column"
        height={state.VIEWPORT_HEIGHT}
        overflow="hidden"
        paddingX={1}
        marginBottom={1}
      >
        {visibleLines.map((line, i) => (
          <Box key={i}>
            {/* Run highlighting only if it looks like JSON structure */}
            {!line ? (
              <Text>{" "}</Text>
            ) : /^\s*([{\}[\]"]|true|false|null|-?\d)/.test(line) ? (
              highlightJsonLine(line)
            ) : (
              <Text
                color={
                  line.startsWith("  █") || line.startsWith("  ╚") ? "magenta" :
                    line.startsWith("rqs ❯") ? "magenta" :
                      line.startsWith("❯") ? "yellow" :
                        "white"
                }
                bold={line.startsWith("  █") || line.startsWith("  ╚")}
              >
                {line}
              </Text>
            )}
          </Box>
        ))}
      </Box>

      {/* Mascot loading animations */}
      {state.loading && (
        <Box gap={1} paddingX={1} marginBottom={1}>
          <Text color="yellow">{SPINNER_FRAMES[state.spinnerFrame]}</Text>
          <Text color="yellow">Executing remote HTTP call...</Text>
        </Box>
      )}

      {/* Prompt Input bar */}
      <Box
        borderStyle="round"
        borderColor="magenta"
        paddingX={1}
        marginTop={0}
      >
        {state.panel === "input" ? (
          <Box>
            <Text color="magenta" bold>rqs ❯ </Text>
            {(() => {
              const { value, cursor } = state.inputValue;
              const before = value.slice(0, cursor);
              const atCursor = value[cursor] ?? " ";
              const after = value.slice(cursor + 1);
              return (
                <Text>
                  <Text color="white">{before}</Text>
                  <Text backgroundColor="magenta" color="black">{atCursor}</Text>
                  <Text color="white">{after}</Text>
                </Text>
              );
            })()}
            {state.suggestion && (
              <Text color="gray">{state.suggestion}  <Text dimColor>(Tab completion)</Text></Text>
            )}
          </Box>
        ) : (
          <Box gap={2}>
            <Text color="yellow" bold>SCROLL MODE ❯ </Text>
            <Text color="gray">
              <Text color="magenta">j/k (↑/↓)</Text> scroll log  •
              <Text color="magenta">v</Text> inspect response  •
              <Text color="green">c</Text> copy body  •
              <Text color="yellow">Esc / i</Text> edit  •
              <Text color="red">q</Text> quit
            </Text>
          </Box>
        )}
      </Box>

      {/* Guide bar for Edit/Input Mode */}
      {state.panel === "input" && (
        <Box paddingX={2} marginTop={0}>
          <Text dimColor>
            Press <Text color="magenta">Esc</Text> scroll mode  •  Type <Text color="magenta">/help</Text> commands  •  Press <Text color="magenta">v</Text> inspector
          </Text>
        </Box>
      )}
    </Box>
  );
}
