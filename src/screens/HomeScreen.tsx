import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface HomeScreenProps {
  onNavigate: (screen: "home" | "request" | "collections" | "history") => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const menuItems = [
    { label: "New Request", value: "request" },
    { label: "Collections", value: "collections" },
    { label: "History", value: "history" },
    { label: "Exit", value: "exit" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((current) =>
        current === 0 ? menuItems.length - 1 : current - 1
      );
    }

    if (key.downArrow) {
      setSelectedIndex((current) =>
        current === menuItems.length - 1 ? 0 : current + 1
      );
    }

    if (key.return) {
      const selected =
        (menuItems[selectedIndex] as (typeof menuItems)[number]) ||
        menuItems[0];
      if (selected.value === "exit") {
        process.exit(0);
      }
      onNavigate(selected.value as "request" | "collections" | "history");
    }

    if (input === "1") setSelectedIndex(0);
    if (input === "2") setSelectedIndex(1);
    if (input === "3") setSelectedIndex(2);
    if (input === "4") setSelectedIndex(3);
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text bold>PostCLI</Text>
        <Text> - Lightweight HTTP Client</Text>
      </Box>

      <Box flexDirection="column" gap={1}>
        {menuItems.map((item, index) => (
          <Box key={item.value}>
            <Text>
              {selectedIndex === index ? "> " : "  "}
              {item.label}
            </Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={2} gap={2}>
        <Text color="gray">↑/↓ Navigate</Text>
        <Text color="gray">Enter Select</Text>
        <Text color="gray">1-4 Direct</Text>
      </Box>
    </Box>
  );
}
