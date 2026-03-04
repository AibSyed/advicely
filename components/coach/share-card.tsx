"use client";

import NextLink from "next/link";
import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { readProgression } from "@/lib/state/progression";

type ShareCardProps = {
  id: string;
};

export function ShareCard({ id }: ShareCardProps) {
  const state = useMemo(() => readProgression(), []);
  const selected = useMemo(() => {
    if (id === "latest") {
      return state.reflections[0] ?? null;
    }
    return state.reflections.find((entry) => entry.id.includes(id) || entry.id === id) ?? null;
  }, [id, state.reflections]);

  return (
    <Stack gap={6}>
      <Box
        border="1px solid"
        borderColor="rgba(15, 23, 42, 0.1)"
        bg="white"
        borderRadius="2xl"
        boxShadow="0 14px 50px rgba(15, 23, 42, 0.15)"
        p={{ base: 5, md: 6 }}
        maxW="xl"
        mx="auto"
      >
        <Text fontSize="xs" letterSpacing="0.25em" textTransform="uppercase" color="#334155">
          Share Snapshot
        </Text>
        <Heading mt={2} fontSize={{ base: "xl", md: "2xl" }} color="#0f172a">
          Momentum Proof Card
        </Heading>

        {selected ? (
          <Stack mt={4} gap={4}>
            <Badge bg="#99f6e4" color="#0f172a" textTransform="uppercase">{selected.theme}</Badge>
            <Text fontSize="lg" color="#1e293b">{selected.text}</Text>
            <Text fontSize="sm" color="#475569">+{selected.xpAwarded} XP · {new Date(selected.createdAt).toLocaleString()}</Text>
            <Text fontSize="sm" color="#334155">
              This card contains reflection text only. No provider identifiers, secrets, or private context are exposed.
            </Text>
          </Stack>
        ) : (
          <Stack mt={4} gap={3}>
            <Text color="#334155">No matching reflection found for this share id.</Text>
            <Text fontSize="sm" color="#475569">Create a new reflection in the daily loop and revisit this route.</Text>
          </Stack>
        )}

        <Stack mt={6} direction={{ base: "column", sm: "row" }} gap={3}>
          <Button asChild bg="#ff7a1a" color="white" _hover={{ bg: "#db5f06" }}>
            <NextLink href="/">Back to daily loop</NextLink>
          </Button>
          <Button asChild variant="outline" borderColor="#0f766e" color="#0f766e">
            <NextLink href="/library">View library</NextLink>
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
