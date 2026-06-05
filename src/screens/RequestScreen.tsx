import { Box, Text } from "ink";
import RequestPanel from "../components/RequestPanel.js";
import ResponsePanel from "../components/ResponsePanel.js";
import KeyBindings from "../components/KeyBindings.js";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation.js";
import { useUiState } from "../hooks/useUiState.js";

interface RequestScreenProps {
  onBack: () => void;
}

export default function RequestScreen({ onBack }: RequestScreenProps) {
  
  useKeyboardNavigation({ onBack })

  return (
    <Box flexDirection="column">
      <Box paddingX={1} paddingBottom={0}>
        <Text bold color="cyan">PostCLI </Text>
        <Text>HTTP Request Builder</Text>
      </Box>
      <Box borderStyle="single" borderColor="gray" flexDirection="row">
        <RequestPanel />
        <ResponsePanel />
      </Box>
      <KeyBindings />
    </Box>
  );
}