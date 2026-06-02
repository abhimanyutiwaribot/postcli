import { Box, Text } from "ink";

interface SettingScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingScreenProps) {
  return (
    <Box>
      <Text bold>Settings...</Text>
    </Box>
  )
}