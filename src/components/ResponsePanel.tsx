import { Box, Text } from "ink";
import { RIGHT_DIVIDER, VIEWPORT_HEIGHT } from "../constants/constants.js";
import { useResponseState } from "../hooks/useResponseState.js";
import { useUiState } from "../hooks/useUiState.js";
import { byteSize, statusColor } from "../utils/response.js";
import { useResponseAction } from "../hooks/useResponseAction.js";

export default function ResponsePanel(){
  const responseState = useResponseState()
  const uiState = useUiState()
  const { paddedLines, totalLines} = useResponseAction()

  const rightActive = uiState.panel === "right";

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1} paddingY={1}>

          {/* Response tabs */}
          <Box gap={3} marginBottom={0}>
            <Text
              bold
              color={uiState.rightTab === "body" ? "green" : "gray"}
              underline={uiState.rightTab === "body"}
            >
              RESPONSE BODY
            </Text>
            <Text
              bold
              color={uiState.rightTab === "headers" ? "green" : "gray"}
              underline={uiState.rightTab === "headers"}
            >
              HEADERS
            </Text>
            {rightActive && (
              <Text dimColor>  h/l switch  j/k scroll</Text>
            )}
          </Box>

          <Text dimColor>{RIGHT_DIVIDER}</Text>

          {/* Fixed-height viewport */}
          <Box flexDirection="column" height={VIEWPORT_HEIGHT} overflow="hidden">
            {responseState.loading && (
              <Text color="gray">⟳  Sending...</Text>
            )}

            {!responseState.loading && !responseState.response && (
              <Text dimColor>Press [e] to send the request.</Text>
            )}

            {!responseState.loading && responseState.response && "error" in responseState.response && (
              <Box flexDirection="column">
                <Text color="red" bold>✗ Request Failed</Text>
                <Text color="red">{responseState.response.error}</Text>
              </Box>
            )}

            {!responseState.loading && responseState.response && !("error" in responseState.response) &&
              paddedLines.map((line, i) => (
                <Text key={i}>{line}</Text>
              ))
            }
          </Box>

          <Text dimColor>{RIGHT_DIVIDER}</Text>

          {/* Status bar */}
          <Box gap={3} marginTop={0}>
            {responseState.response && !("error" in responseState.response) ? (
              <>
                <Text>
                  <Text dimColor>Status: </Text>
                  <Text color={statusColor(responseState.response.status)} bold>
                    {responseState.response.status} {responseState.response.status < 400 ? "ok" : "err"}
                  </Text>
                </Text>
                <Text>
                  <Text dimColor>Time: </Text>
                  <Text>{responseState.response.time}ms</Text>
                </Text>
                <Text>
                  <Text dimColor>Size: </Text>
                  <Text>{byteSize(responseState.response.body)}</Text>
                </Text>
                {totalLines > VIEWPORT_HEIGHT && (
                  <Text dimColor>[{responseState.respScroll + 1}–{Math.min(responseState.respScroll + VIEWPORT_HEIGHT, totalLines)}/{totalLines}]</Text>
                )}
                {responseState.copied
                  ? <Text color="green">✓ Copied!</Text>
                  : null
                }
              </>
            ) : responseState.response && "error" in responseState.response ? (
              <>
                <Text><Text dimColor>Status: </Text><Text color="red">error</Text></Text>
                <Text><Text dimColor>Time: </Text><Text>{responseState.response.time}ms</Text></Text>
                <Text><Text dimColor>Size: </Text><Text>—</Text></Text>
              </>
            ) : (
              <>
                <Text dimColor>Status: —</Text>
                <Text dimColor>Time: —</Text>
                <Text dimColor>Size: —</Text>
              </>
            )}
          </Box>

        </Box>
  )
}