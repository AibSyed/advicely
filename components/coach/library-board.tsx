"use client";

import NextLink from "next/link";
import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { starterLibrary } from "@/features/coaching/themes";
import { readProgression } from "@/lib/state/progression";

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      border="1px solid"
      borderColor="rgba(15, 23, 42, 0.1)"
      bg="white"
      borderRadius="2xl"
      boxShadow="0 14px 50px rgba(15, 23, 42, 0.15)"
      p={{ base: 5, md: 6 }}
    >
      {children}
    </Box>
  );
}

export function LibraryBoard() {
  const state = useMemo(() => readProgression(), []);

  return (
    <Stack gap={6}>
      <Panel>
        <Text fontSize="xs" letterSpacing="0.3em" textTransform="uppercase" color="#334155">
          Reflection Library
        </Text>
        <Heading mt={2} fontSize={{ base: "2xl", md: "4xl" }} color="#0f172a">
          Replay Your Best Momentum Scripts
        </Heading>
        <Text mt={3} color="#334155" maxW="2xl">
          Keep your highest-quality prompts and reflection outputs organized for repeat execution.
        </Text>

        <SimpleGrid mt={6} columns={{ base: 1, md: 2 }} gap={4}>
          {starterLibrary.map((item) => (
            <Box key={item.id} border="1px solid" borderColor="rgba(15, 23, 42, 0.1)" borderRadius="xl" p={4} bg="#f8fafc">
              <Badge bg="#fed7aa" color="#0f172a" textTransform="uppercase">{item.theme}</Badge>
              <Heading mt={3} fontSize="xl" color="#0f172a">{item.title}</Heading>
              <Text mt={2} color="#334155">{item.description}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Heading mt={8} fontSize="lg" color="#0f172a">Saved reflections</Heading>
        <Stack mt={3} gap={3}>
          {state.reflections.slice(0, 12).map((entry) => (
            <Box key={entry.id} border="1px solid" borderColor="rgba(15, 23, 42, 0.12)" borderRadius="xl" p={4}>
              <Badge bg="#99f6e4" color="#0f172a" textTransform="uppercase">{entry.theme}</Badge>
              <Text mt={2} color="#1e293b">{entry.text}</Text>
              <Text mt={2} fontSize="sm" color="#475569">{new Date(entry.createdAt).toLocaleString()}</Text>
            </Box>
          ))}
          {state.reflections.length === 0 && (
            <Text color="#475569">No reflections yet. Finish one daily coaching session to populate this library.</Text>
          )}
        </Stack>

        <Stack mt={6} direction={{ base: "column", sm: "row" }} gap={3}>
          <Button asChild bg="#ff7a1a" color="white" _hover={{ bg: "#db5f06" }}>
            <NextLink href="/">Back to daily loop</NextLink>
          </Button>
          <Button asChild variant="outline" borderColor="#0f766e" color="#0f766e">
            <NextLink href="/progress">Open progress</NextLink>
          </Button>
        </Stack>
      </Panel>
    </Stack>
  );
}
