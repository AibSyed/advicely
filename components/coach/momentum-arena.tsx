"use client";

import NextLink from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Field,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { coachingResponseSchema, type CoachingResponse, type Theme } from "@/features/coaching/schema";
import {
  applyReflection,
  getLevel,
  readProgression,
  writeProgression,
  xpWindow,
  type ProgressionState,
} from "@/lib/state/progression";

const reflectionSchema = z.object({
  reflection: z
    .string()
    .trim()
    .min(12, "Write at least 12 characters so your commitment is meaningful."),
});

type ReflectionForm = z.infer<typeof reflectionSchema>;

const themes: Array<{ label: string; value: Theme }> = [
  { label: "Focus", value: "focus" },
  { label: "Confidence", value: "confidence" },
  { label: "Resilience", value: "resilience" },
  { label: "Clarity", value: "clarity" },
];

const rewardMilestones = [
  { threshold: 1, label: "Starter", note: "First check-in completed" },
  { threshold: 3, label: "On Fire", note: "3-day momentum streak" },
  { threshold: 7, label: "Consistent", note: "7-day consistency lock" },
  { threshold: 15, label: "Relentless", note: "15-day elite focus" },
];

async function fetchCoaching(theme: Theme) {
  const response = await fetch(`/api/coaching?theme=${theme}`);
  if (!response.ok) {
    throw new Error("Coaching unavailable");
  }
  return coachingResponseSchema.parse((await response.json()) as CoachingResponse);
}

const MotionBox = motion.create(Box);
const latestShareHref = "/share/latest" as Route;

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

export function MomentumArena() {
  const [theme, setTheme] = useState<Theme>("focus");
  const [state, setState] = useState<ProgressionState>(() => readProgression());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReflectionForm>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: { reflection: "" },
  });

  useEffect(() => {
    writeProgression(state);
  }, [state]);

  const query = useQuery({ queryKey: ["coaching", theme], queryFn: () => fetchCoaching(theme) });

  const level = getLevel(state.totalXp);
  const progressWindow = xpWindow(state.totalXp);
  const progressPercent =
    ((state.totalXp - progressWindow.min) / (progressWindow.max - progressWindow.min)) * 100;

  const unlockedRewards = useMemo(
    () => rewardMilestones.filter((milestone) => state.streakDays >= milestone.threshold),
    [state.streakDays]
  );

  async function onSaveReflection(values: ReflectionForm) {
    if (!query.data) {
      return;
    }

    setState((current) =>
      applyReflection(current, {
        id: `${query.data.card.id}-${Date.now()}`,
        theme: query.data.card.theme,
        text: values.reflection,
        createdAt: new Date().toISOString(),
        xpAwarded: query.data.card.xpReward,
      })
    );

    reset({ reflection: "" });

    const confetti = await import("canvas-confetti");
    confetti.default({
      particleCount: 80,
      spread: 70,
      startVelocity: 26,
      origin: { y: 0.7 },
    });
  }

  return (
    <Stack gap={6}>
      <Panel>
        <Text fontSize="xs" letterSpacing="0.34em" textTransform="uppercase" color="#334155">
          Momentum Control Room
        </Text>
        <Heading mt={2} fontSize={{ base: "2xl", md: "4xl" }} color="#0f172a">
          Build Daily Coaching Velocity
        </Heading>
        <Text mt={3} color="#334155" maxW="3xl">
          Reward-driven coaching loops with reflection capture, streak mechanics, and safety-filtered live prompts.
        </Text>

        <HStack mt={5} gap={2} flexWrap="wrap">
          <Button asChild variant="outline" borderColor="#0f766e" color="#0f766e">
            <NextLink href="/progress">View progression</NextLink>
          </Button>
          <Button asChild variant="outline" borderColor="#ea580c" color="#ea580c">
            <NextLink href="/library">Reflection library</NextLink>
          </Button>
          <Button asChild variant="outline" borderColor="#0e7490" color="#0e7490">
            <NextLink href={latestShareHref}>Share card</NextLink>
          </Button>
        </HStack>
      </Panel>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} alignItems="start">
        <GridItem>
          <Panel>
            <Stack gap={5}>
              <HStack gap={2} flexWrap="wrap" role="tablist" aria-label="Coaching themes">
                {themes.map((entry) => (
                  <Button
                    key={entry.value}
                    size="sm"
                    variant={theme === entry.value ? "solid" : "outline"}
                    bg={theme === entry.value ? "#ff7a1a" : "transparent"}
                    color={theme === entry.value ? "white" : "#0f172a"}
                    borderColor="rgba(15, 23, 42, 0.2)"
                    _hover={{ bg: theme === entry.value ? "#db5f06" : "rgba(15, 23, 42, 0.06)" }}
                    onClick={() => setTheme(entry.value)}
                    textTransform="none"
                    aria-pressed={theme === entry.value}
                  >
                    {entry.label}
                  </Button>
                ))}
              </HStack>

              <Box minH={{ base: "42rem", md: "38rem" }}>
                {query.isPending && (
                  <Box border="1px solid" borderColor="rgba(15, 23, 42, 0.12)" borderRadius="xl" bg="#fff7ed" p={4} h="full">
                    <Text color="#334155">Generating your next coaching card...</Text>
                  </Box>
                )}

                {query.isError && (
                  <Box border="1px solid" borderColor="#fecaca" borderRadius="xl" bg="#fef2f2" p={4} h="full">
                    <Text color="#b91c1c">Unable to fetch coaching card right now. Retry in a moment.</Text>
                  </Box>
                )}

                <AnimatePresence mode="wait">
                  {query.data && (
                    <MotionBox
                      key={query.data.card.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.22 }}
                    >
                      <Box border="1px solid" borderColor="rgba(15, 23, 42, 0.12)" borderRadius="2xl" bg="linear-gradient(140deg, #fffbeb, #f0fdfa)" p={5}>
                        <Stack gap={4}>
                        <HStack flexWrap="wrap" gap={2}>
                          <Badge bg={query.data.card.fallbackUsed ? "#fed7aa" : "#99f6e4"} color="#0f172a">
                            {query.data.card.fallbackUsed ? "Fallback" : "Live"}
                          </Badge>
                          <Badge bg="#bae6fd" color="#0f172a">{Math.round(query.data.card.confidenceScore * 100)}% confidence</Badge>
                          <Badge bg="#bbf7d0" color="#0f172a">+{query.data.card.xpReward} XP</Badge>
                        </HStack>

                        <Heading fontSize={{ base: "xl", md: "2xl" }} color="#0f172a">
                          {query.data.card.headline}
                        </Heading>
                        <Text fontSize={{ base: "lg", md: "xl" }} color="#1e293b">
                          {query.data.card.prompt}
                        </Text>

                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                          <Box border="1px solid" borderColor="rgba(15, 23, 42, 0.15)" borderRadius="xl" p={4} bg="rgba(255,255,255,0.85)">
                            <Text fontWeight={700} color="#0f172a">Reflection Prompt</Text>
                            <Text mt={2} color="#334155">{query.data.card.reflection}</Text>
                          </Box>
                          <Box border="1px solid" borderColor="rgba(15, 23, 42, 0.15)" borderRadius="xl" p={4} bg="rgba(255,255,255,0.85)">
                            <Text fontWeight={700} color="#0f172a">Micro Action</Text>
                            <Text mt={2} color="#334155">{query.data.card.microAction}</Text>
                          </Box>
                        </SimpleGrid>

                        <Box as="form" onSubmit={handleSubmit(onSaveReflection)}>
                          <Field.Root invalid={Boolean(errors.reflection)}>
                            <Field.Label htmlFor="reflection">Write your commitment</Field.Label>
                            <Input
                              id="reflection"
                              placeholder="I will execute..."
                              bg="white"
                              borderColor="rgba(15, 23, 42, 0.2)"
                              {...register("reflection")}
                            />
                            <Field.ErrorText>{errors.reflection?.message}</Field.ErrorText>
                          </Field.Root>
                          <HStack mt={3} gap={3}>
                            <Button
                              type="submit"
                              bg="#ff7a1a"
                              color="white"
                              _hover={{ bg: "#db5f06" }}
                              loading={isSubmitting}
                            >
                              Claim XP
                            </Button>
                            <Button
                              variant="outline"
                              borderColor="#0f766e"
                              color="#0f766e"
                              onClick={() => query.refetch()}
                            >
                              Reroll card
                            </Button>
                          </HStack>
                        </Box>
                        </Stack>
                      </Box>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
            </Stack>
          </Panel>
        </GridItem>

        <GridItem>
          <Stack gap={4}>
            <Panel>
              <Heading fontSize="lg" color="#0f172a">Progress Pulse</Heading>
              <Text mt={3} color="#334155">Level {level}</Text>
              <Text color="#334155">Streak: {state.streakDays} days</Text>
              <Text color="#334155">Sessions: {state.sessionsCompleted}</Text>
              <Text color="#334155">Total XP: {state.totalXp}</Text>
              <Box mt={3} bg="#e2e8f0" borderRadius="full" h="10px" overflow="hidden" aria-label="Level progress">
                <Box h="full" w={`${Math.max(0, Math.min(progressPercent, 100))}%`} bg="#ff7a1a" transition="width 0.25s ease" />
              </Box>
              <Text mt={2} fontSize="sm" color="#475569">Next level at {progressWindow.max} XP</Text>
            </Panel>

            <Panel>
              <Heading fontSize="md" color="#0f172a">Streak Rewards</Heading>
              <Stack mt={3} gap={2}>
                {rewardMilestones.map((reward) => {
                  const unlocked = unlockedRewards.some((entry) => entry.threshold === reward.threshold);
                  return (
                    <Box
                      key={reward.threshold}
                      border="1px solid"
                      borderColor={unlocked ? "#2dd4bf" : "rgba(15, 23, 42, 0.16)"}
                      borderRadius="xl"
                      p={3}
                      bg={unlocked ? "#f0fdfa" : "#f8fafc"}
                    >
                      <Text fontWeight={700} color="#0f172a">{reward.label}</Text>
                      <Text fontSize="sm" color="#334155">{reward.note}</Text>
                    </Box>
                  );
                })}
              </Stack>
            </Panel>

            <Panel>
              <Heading fontSize="md" color="#0f172a">Recent reflections</Heading>
              <Stack mt={3} gap={2}>
                {state.reflections.slice(0, 4).map((entry) => (
                  <Box key={entry.id} border="1px solid" borderColor="rgba(15, 23, 42, 0.16)" borderRadius="xl" p={3}>
                    <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.18em" color="#0f766e">
                      {entry.theme}
                    </Text>
                    <Text mt={1} color="#1e293b">{entry.text}</Text>
                  </Box>
                ))}
                {state.reflections.length === 0 && (
                  <Text fontSize="sm" color="#475569">No reflections logged yet.</Text>
                )}
              </Stack>
            </Panel>
          </Stack>
        </GridItem>
      </Grid>
    </Stack>
  );
}
