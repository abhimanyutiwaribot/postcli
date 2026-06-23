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

  const INSPECTOR_HEIGHT = 25;

  // ── RENDER MODE: RESPONSE INSPECTOR ──
  if (state.viewingResponse) {
    const isBodyTab = state.inspectorTab === "body";
    
    // Parse inspector lines based on active tab
    const inspectorLines = isBodyTab
      ? state.lastResponseBody.split("\n")
      : Object.entries(state.lastResponseHeaders).map(([k, v]) => `${k}: ${v}`);

    const visibleInspectorLines = inspectorLines.slice(
      state.inspectorScroll,
      state.inspectorScroll + INSPECTOR_HEIGHT
    );

    const paddedInspectorLines = [
      ...visibleInspectorLines,
      ...Array(Math.max(0, INSPECTOR_HEIGHT - visibleInspectorLines.length)).fill("")
    ];

    return (
      <Box flexDirection="column" padding={1}>
        {/* Inspector Header */}
        <Box paddingX={1} gap={1} marginBottom={0}>
          <Text bold color="magenta">❯ Response Details</Text>
          <Text dimColor>—</Text>
          <Text color="gray">
            Status: <Text color={state.lastResponseStatus.includes("Error") || state.lastResponseStatus.includes("failed") ? "red" : "green"} bold>{state.lastResponseStatus}</Text>  •  
            Time: <Text color="white">{state.lastResponseTime}ms</Text>  •  
            Size: <Text color="white">{state.lastResponseSize}</Text>
          </Text>
        </Box>

        {/* Side-by-side Layout: Viewport (Left) + Mascot Sidebar (Right) */}
        <Box flexDirection="row" marginTop={1}>
          {/* Left Column: Tab Buttons + Viewport */}
          <Box flexDirection="column" flexGrow={1}>
            {/* Tab Buttons */}
            <Box paddingX={1} gap={3} marginBottom={1}>
              <Text bold color={isBodyTab ? "cyan" : "gray"}>
                {isBodyTab ? "● Body" : "  Body"}
              </Text>
              <Text bold color={!isBodyTab ? "cyan" : "gray"}>
                {!isBodyTab ? "● Headers" : "  Headers"}
              </Text>
              <Text dimColor>(Tab to switch)</Text>
            </Box>

            {/* Viewport Box */}
            <Box 
              flexDirection="column" 
              height={INSPECTOR_HEIGHT} 
              overflow="hidden" 
              paddingX={1} 
              marginBottom={1}
            >
              {paddedInspectorLines.map((line, i) => (
                <Box key={i}>
                  {isBodyTab ? (
                    highlightJsonLine(line)
                  ) : (
                    <Text color="white">{line}</Text>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Column: Mascot Companion Sidebar */}
          <Box 
            flexDirection="column" 
            width={22} 
            paddingLeft={2} 
            flexShrink={0}
            justifyContent="center"
          >
            {state.lastResponseStatus.includes("Error") || state.lastResponseStatus.includes("failed") ? (
              <Box flexDirection="column">
                {(FAILURE_FRAMES[state.inspectorFrame] || []).map((line, idx) => (
                  <Text key={idx} color="red">{line}</Text>
                ))}
              </Box>
            ) : (
              <Box flexDirection="column">
                {(VICTORY_FRAMES[state.inspectorFrame] || []).map((line, idx) => (
                  <Text key={idx} color="green">{line}</Text>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Scroll coordinates & copy confirmation */}
        <Box paddingX={1} gap={2} height={1}>
          {inspectorLines.length > INSPECTOR_HEIGHT && (
            <Text dimColor>
              Line {state.inspectorScroll + 1}–{Math.min(state.inspectorScroll + INSPECTOR_HEIGHT, inspectorLines.length)} of {inspectorLines.length}
            </Text>
          )}
          {state.copied && (
            <Text color="green">✓ Copied response body to clipboard!</Text>
          )}
        </Box>

        {/* Bottom Help Bar */}
        <Box paddingX={1} marginTop={1}>
          <Text dimColor>
            <Text color="cyan">Tab</Text> toggle tabs  •  
            <Text color="cyan">j/k (↑/↓)</Text> scroll  •  
            <Text color="green">c</Text> copy body  •  
            <Text color="red">Esc / q</Text> close inspector
          </Text>
        </Box>
      </Box>
    );
  }

  // ── RENDER MODE: STANDARD REPL CONSOLE ──
  const visibleLines = state.consoleLines.slice(
    state.scrollOffset,
    state.scrollOffset + state.VIEWPORT_HEIGHT
  );

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box paddingX={1} gap={1} marginBottom={0}>
        <Text bold color="cyan">❯ PostCLI REPL</Text>
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
        maxHeight={state.VIEWPORT_HEIGHT} 
        overflow="hidden" 
        paddingX={1} 
        marginBottom={1}
      >
        {visibleLines.map((line, i) => (
          <Box key={i}>
            {/* Run highlighting only if it looks like JSON structure */}
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

      {/* Mascot loading animations */}
      {state.loading && (
        <Box gap={1} paddingX={1} marginBottom={1}>
          <Text color="yellow">{SPINNER_FRAMES[state.spinnerFrame]}</Text>
          <Text color="yellow">Executing remote HTTP call...</Text>
        </Box>
      )}

      {/* Prompt Input bar */}
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
              <Text color="cyan">v</Text> inspect response  •  
              <Text color="green">c</Text> copy body  •  
              <Text color="yellow">Esc / i</Text> edit  •  
              <Text color="red">q</Text> quit
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}