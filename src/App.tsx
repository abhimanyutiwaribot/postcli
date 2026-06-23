import React from "react";
import { Box, Text } from "ink";
import { usePostCli } from "./hooks/usePostCli.js";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation.js";
import { highlightJsonLine } from "./utils/response.js";
import { VICTORY_FRAMES, FAILURE_FRAMES, SPINNER_FRAMES } from "./utils/animations.js";

export default function App() {
  const state = usePostCli();

  // Wire up REPL keyboard event loop
  useKeyboardNavigation({ state });

  // Get active scrollback lines
  const visibleLines = state.consoleLines.slice(
    state.scrollOffset,
    state.scrollOffset + state.VIEWPORT_HEIGHT
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* ── HEADER ── */}
      <Box paddingX={1} gap={1} marginBottom={0}>
        <Text bold color="cyan">❯ PostCLI REPL</Text>
        <Text dimColor>—</Text>
        <Text color="gray">interactive HTTP shell console</Text>
      </Box>

      {/* ── ACTIVE SETTINGS BADGE ── */}
      <Box paddingX={1} marginBottom={1} gap={2}>
        <Text color="gray">
          Base URL: {state.baseUrl ? <Text color="green" bold>{state.baseUrl}</Text> : <Text dimColor>none (use /set base &lt;url&gt;)</Text>}
        </Text>
        {state.lastResponseBody && (
          <Text color="gray">
            Last Response: <Text color="magenta">available</Text> <Text dimColor>(Esc+c to copy)</Text>
          </Text>
        )}
      </Box>

      {/* ── SCROLLBACK VIEWPORT ── */}
      <Box 
        flexDirection="column" 
        maxHeight={state.VIEWPORT_HEIGHT} 
        overflow="hidden" 
        paddingX={1} 
        marginBottom={1}
      >
        {visibleLines.map((line, i) => (
          <Box key={i}>
            {/* If line starts with a bracket/brace or whitespace quote, highlight as JSON */}
            {/^\s*([{\}[\]"]|true|false|null|-?\d)/.test(line) ? (
              highlightJsonLine(line)
            ) : (
              <Text color={line.startsWith("postcli ❯") ? "cyan" : line.startsWith("❯") ? "yellow" : "white"}>
                {line}
              </Text>
            )}
          </Box>
        ))}
      </Box>

      {/* ── MASCOT ANIMATION / PROGRESS DISPLAY ── */}
      {state.loading && (
        <Box height={10} paddingX={1} flexDirection="column" justifyContent="center" marginBottom={1}>
          {state.activeAnimation === "success" && (
            <Box flexDirection="column">
              {(VICTORY_FRAMES[state.animationFrame] || []).map((line, idx) => (
                <Text key={idx} color="green">{line}</Text>
              ))}
            </Box>
          )}

          {state.activeAnimation === "failure" && (
            <Box flexDirection="column">
              {(FAILURE_FRAMES[state.animationFrame] || []).map((line, idx) => (
                <Text key={idx} color="red">{line}</Text>
              ))}
            </Box>
          )}

          {!state.activeAnimation && (
            <Box gap={1}>
              <Text color="yellow">{SPINNER_FRAMES[state.spinnerFrame]}</Text>
              <Text color="yellow">Executing remote HTTP call...</Text>
            </Box>
          )}
        </Box>
      )}

      {/* ── INTERACTIVE PROMPT LINE ── */}
      <Box paddingX={1} marginTop={1}>
        {state.panel === "input" ? (
          <Box>
            <Text color="cyan" bold>postcli ❯ </Text>
            {(() => {
              const { value, cursor } = state.inputValue;
              const before = value.slice(0, cursor);
              const atCursor = value[cursor] ?? " ";
              const after = value.slice(cursor + 1);
              return (
                <Text>
                  <Text color="white">{before}</Text>
                  <Text backgroundColor="cyan" color="black">{atCursor}</Text>
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
              <Text color="cyan">j/k (↑/↓)</Text> scroll log  •  
              <Text color="green">c</Text> copy last response  •  
              <Text color="yellow">Esc / i</Text> back to prompt  •  
              <Text color="red">q</Text> quit
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}