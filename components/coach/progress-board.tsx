"use client";

import NextLink from "next/link";
import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getLevel, readProgression, xpWindow } from "@/lib/state/progression";

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

export function ProgressBoard() {
  const state = useMemo(() => readProgression(), []);
  const level = getLevel(state.totalXp);
  const window = xpWindow(state.totalXp);
  const progress = ((state.totalXp - window.min) / (window.max - window.min)) * 100;

  const cadence = useMemo(() => {
    if (state.sessionsCompleted === 0) {
      return "No cadence yet";
    }

    const averageXp = Math.round(state.totalXp / state.sessionsCompleted);
    return `${averageXp} XP / session`;
  }, [state.sessionsCompleted, state.totalXp]);

  return (
    <Stack gap={6}>
      <Panel>
        <Text fontSize="xs" letterSpacing="0.3em" textTransform="uppercase" color="#334155">
          Progress Console
        </Text>
        <Heading mt={2} fontSize={{ base: "2xl", md: "4xl" }} color="#0f172a">
          Momentum Performance Report
        </Heading>
        <Text mt={3} color="#334155" maxW="2xl">
          Track streak pressure, XP growth, and session consistency to keep your coaching loop compounding.
        </Text>

        <Grid mt={6} templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <GridItem>
            <Box border="1px solid" borderColor="#fed7aa" borderRadius="xl" p={4} bg="#fff7ed">
              <Text fontSize="xs" color="#475569" textTransform="uppercase" letterSpacing="0.2em">
                Current level
              </Text>
              <Heading fontSize="2xl" mt={2}>{level}</Heading>
              <Text mt={2} color="#334155">Next unlock at {window.max} XP</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box border="1px solid" borderColor="#99f6e4" borderRadius="xl" p={4} bg="#f0fdfa">
              <Text fontSize="xs" color="#475569" textTransform="uppercase" letterSpacing="0.2em">
                Active streak
              </Text>
              <Heading fontSize="2xl" mt={2}>{state.streakDays} days</Heading>
              <Text mt={2} color="#334155">Cadence: {cadence}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box border="1px solid" borderColor="#bae6fd" borderRadius="xl" p={4} bg="#f0f9ff">
              <Text fontSize="xs" color="#475569" textTransform="uppercase" letterSpacing="0.2em">
                Sessions completed
              </Text>
              <Heading fontSize="2xl" mt={2}>{state.sessionsCompleted}</Heading>
              <Text mt={2} color="#334155">Reflections saved: {state.reflections.length}</Text>
            </Box>
          </GridItem>
        </Grid>

        <Heading mt={6} fontSize="lg" color="#0f172a">XP progress</Heading>
        <Box mt={3} bg="#e2e8f0" borderRadius="full" h="10px" overflow="hidden">
          <Box h="full" w={`${Math.max(0, Math.min(progress, 100))}%`} bg="#ff7a1a" transition="width 0.25s ease" />
        </Box>
        <Text mt={2} color="#475569">{state.totalXp} / {window.max} XP</Text>

        <Stack mt={6} direction={{ base: "column", sm: "row" }} gap={3}>
          <Button asChild bg="#ff7a1a" color="white" _hover={{ bg: "#db5f06" }}>
            <NextLink href="/">Back to daily loop</NextLink>
          </Button>
          <Button asChild variant="outline" borderColor="#0f766e" color="#0f766e">
            <NextLink href="/library">Open reflection library</NextLink>
          </Button>
        </Stack>

        <Stack mt={8} gap={3}>
          <Heading fontSize="md" color="#0f172a">Recent check-ins</Heading>
          {state.reflections.slice(0, 8).map((entry) => (
            <Box key={entry.id} border="1px solid" borderColor="rgba(15, 23, 42, 0.12)" borderRadius="xl" p={4}>
              <Badge bg="#99f6e4" color="#0f172a" textTransform="uppercase">{entry.theme}</Badge>
              <Text mt={2} color="#1e293b">{entry.text}</Text>
              <Text mt={1} fontSize="sm" color="#475569">+{entry.xpAwarded} XP</Text>
            </Box>
          ))}
          {state.reflections.length === 0 && (
            <Text color="#475569">No check-ins logged yet. Complete your first daily loop on the home route.</Text>
          )}
        </Stack>
      </Panel>
    </Stack>
  );
}
