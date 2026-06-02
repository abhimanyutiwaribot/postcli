import React, { useState } from "react";
import { Box, Text } from "ink";

interface CollectionsScreenProps {
  onBack: () => void;
}

interface Collection {
  id: string;
  name: string;
  requestCount: number;
}

const mockCollections: Collection[] = [
  { id: "1", name: "GitHub API", requestCount: 12 },
  { id: "2", name: "JSONPlaceholder", requestCount: 8 },
  { id: "3", name: "Stripe API", requestCount: 15 },
  { id: "4", name: "OpenWeather API", requestCount: 6 },
];

export default function CollectionsScreen({ onBack }: CollectionsScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={2}>
        <Text bold>Collections</Text>
      </Box>

      <Box marginBottom={2}>
        <Text>{"\u2500".repeat(80)}</Text>
      </Box>

      {/* Collections List */}
      <Box flexDirection="column" marginBottom={2}>
        {mockCollections.map((collection, index) => (
          <Box
            key={collection.id}
            flexDirection="column"
            marginBottom={1}
          >
            <Box>
              <Box width={2}>
                <Text color={selectedIndex === index ? "blue" : "white"}>
                  {selectedIndex === index ? ">" : " "}
                </Text>
              </Box>
              <Box flexGrow={1}>
                <Text bold={selectedIndex === index}>
                  {collection.name}
                </Text>
              </Box>
              <Box width={15} justifyContent="flex-end">
                <Text>
                  {collection.requestCount} requests
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box marginBottom={2}>
        <Text>{"\u2500".repeat(80)}</Text>
      </Box>

      {/* Stats */}
      <Box flexDirection="column" marginBottom={2} gap={1}>
        <Box>
          <Box width={20}>
            <Text>Total Collections:</Text>
          </Box>
          <Text bold>{mockCollections.length}</Text>
        </Box>
        <Box>
          <Box width={20}>
            <Text>Total Requests:</Text>
          </Box>
          <Text bold>
            {mockCollections.reduce((sum, c) => sum + c.requestCount, 0)}
          </Text>
        </Box>
      </Box>

      <Box gap={3}>
        <Text color="white">Enter - Open</Text>
        <Text color="white">N - New</Text>
        <Text color="white">Q - Back</Text>
      </Box>
    </Box>
  );
}
