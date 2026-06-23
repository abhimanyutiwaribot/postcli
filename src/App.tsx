import React from "react";
import { Box, Text } from "ink";
import RequestPanel from "./components/RequestPanel.js";
import ResponsePanel from "./components/ResponsePanel.js";
import KeyBindings from "./components/KeyBindings.js";
import { usePostCli } from "./hooks/usePostCli.js";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation.js";

export default function App() {
  const state = usePostCli();

  // Bind keyboard navigation
  useKeyboardNavigation({ state });

  return (
    <Box flexDirection="column">
      <Box paddingX={1} paddingBottom={0}>
        <Text bold color="cyan">PostCLI </Text>
        <Text>HTTP Request Builder</Text>
      </Box>
      <Box borderStyle="single" borderColor="gray" flexDirection="row">
        <RequestPanel state={state} />
        <ResponsePanel state={state} />
      </Box>
      <KeyBindings />
    </Box>
  );
}