import React from "react";
import { Box, Text } from "ink";
import { highlightJsonLine } from "../utils/response.js";
import { VICTORY_FRAMES, FAILURE_FRAMES } from "../utils/animations.js";
import type { PostCliState } from "../hooks/usePostCli.js";

interface ResponseInspectorProps {
  state: PostCliState;
}

export default function ResponseInspector({ state }: ResponseInspectorProps) {
  const { INSPECTOR_HEIGHT } = state;
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

  const hasFailed = state.lastResponseStatus.includes("Error") || state.lastResponseStatus.includes("failed");

  return (
    <Box flexDirection="column" padding={1}>
      {/* Inspector Header */}
      <Box paddingX={1} gap={1} marginBottom={0}>
        <Text bold color="magenta">❯ Response Details</Text>
        <Text dimColor>—</Text>
        <Text color="gray">
          Status: <Text color={hasFailed ? "red" : "green"} bold>{state.lastResponseStatus}</Text>  •  
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
            <Text bold color={isBodyTab ? "magenta" : "gray"}>
              {isBodyTab ? "● Body" : "  Body"}
            </Text>
            <Text bold color={!isBodyTab ? "magenta" : "gray"}>
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
                {!line ? (
                  <Text>{" "}</Text>
                ) : isBodyTab ? (
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
          {hasFailed ? (
            <Box flexDirection="column">
              {(FAILURE_FRAMES[state.inspectorFrame] || []).map((line, idx) => (
                <Text key={idx} color="red">{line}</Text>
              ))}
            </Box>
          ) : (
            <Box flexDirection="column">
              {(VICTORY_FRAMES[state.inspectorFrame] || []).map((line, idx) => (
                <Text key={idx} color="magenta">{line}</Text>
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
          <Text color="green">
            ✓ Copied {state.copied === "body" ? "response body" : "headers"} to clipboard!
          </Text>
        )}
      </Box>

      {/* Bottom Help Bar */}
      <Box paddingX={1} marginTop={1}>
        <Text dimColor>
          <Text color="magenta">Tab</Text> toggle tabs  •  
          <Text color="magenta">j/k (↑/↓)</Text> scroll  •  
          <Text color="green">c</Text> copy body  •  
          <Text color="red">Esc / q</Text> close inspector
        </Text>
      </Box>
    </Box>
  );
}
