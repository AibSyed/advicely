"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowRight, FiBookmark, FiCompass, FiRefreshCw, FiShare2, FiTrendingUp } from "react-icons/fi";
import { adviceResponseSchema, type AdviceResponse, type ToneProfile } from "@/features/advice/contracts";
import { getAdviceFitLabel, getAdviceSignalLabel, getToneProfileLabel } from "@/features/advice/presentation";
import { createShareCard, getMomentumState, recordGeneration, saveAdviceCard } from "@/features/momentum/storage";

const toneProfiles: Array<{ id: ToneProfile; label: string; hint: string }> = [
  { id: "grounded", label: "Practical", hint: "Straight and useful" },
  { id: "bold", label: "Direct", hint: "Pushes you to act" },
  { id: "calm", label: "Calm", hint: "Steady and low stress" },
  { id: "playful", label: "Light", hint: "Friendly and energizing" },
];

interface SnapshotStats {
  streakDays: number;
  totalGenerations: number;
  savedCount: number;
}

async function fetchAdvice(toneProfile: ToneProfile, recentHashes: string[]): Promise<AdviceResponse> {
  const params = new URLSearchParams({ tone: toneProfile });
  if (recentHashes.length > 0) {
    params.set("recent", recentHashes.slice(0, 12).join(","));
  }

  const response = await fetch(`/api/advice?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Advice request failed");
  }

  const parsed = adviceResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Advice payload failed validation");
  }

  return parsed.data;
}

export function AdviceReactor() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [toneProfile, setToneProfile] = useState<ToneProfile>("grounded");
  const [adviceResponse, setAdviceResponse] = useState<AdviceResponse | null>(null);
  const [recentHashes, setRecentHashes] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [snapshotStats, setSnapshotStats] = useState<SnapshotStats>({
    streakDays: 0,
    totalGenerations: 0,
    savedCount: 0,
  });

  const lastRecordedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const momentumState = getMomentumState();
    setRecentHashes(momentumState.generatedHistory.map((item) => item.textHash));
    setSnapshotStats({
      streakDays: momentumState.streakDays,
      totalGenerations: momentumState.totalGenerations,
      savedCount: momentumState.savedCards.length,
    });
  }, []);

  const adviceMutation = useMutation({
    mutationFn: () => fetchAdvice(toneProfile, recentHashes),
    onSuccess: (payload) => {
      setAdviceResponse(payload);
      if (lastRecordedIdRef.current === payload.card.id) {
        return;
      }

      lastRecordedIdRef.current = payload.card.id;
      const nextState = recordGeneration(payload.card);
      setRecentHashes(nextState.generatedHistory.map((item) => item.textHash));
      setSnapshotStats({
        streakDays: nextState.streakDays,
        totalGenerations: nextState.totalGenerations,
        savedCount: nextState.savedCards.length,
      });
    },
  });

  const adviceCard = adviceResponse?.card;
  const adviceFitLabel = adviceCard ? getAdviceFitLabel(adviceCard.confidence) : "--";
  const adviceSignalLabel = adviceCard ? getAdviceSignalLabel(adviceCard.errorState, adviceCard.fallbackUsed) : null;

  function handleGenerate() {
    setStatusMessage(null);
    adviceMutation.mutate();
  }

  function handleSave() {
    if (!adviceCard) {
      return;
    }

    const nextState = saveAdviceCard(adviceCard);
    setSnapshotStats((prev) => ({ ...prev, savedCount: nextState.savedCards.length }));
    setStatusMessage("Saved to your library.");
  }

  function handleShare() {
    if (!adviceCard) {
      return;
    }

    const shareCard = createShareCard(adviceCard);
    router.push(`/share/${shareCard.id}`);
  }

  return (
    <Container maxW="7xl" py={{ base: "1.25rem", md: "2.5rem" }}>
      <Stack gap={{ base: 6, md: 8 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          align={{ base: "flex-start", lg: "flex-end" }}
          gap={6}
        >
          <Stack gap={3} maxW="3xl">
            <Badge alignSelf="flex-start" bg="ember.500" color="white" px={3} py={1} borderRadius="full">
              Advicely v4
            </Badge>
            <Heading as="h1" id="main-content" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.05">
              Get clear advice in one click.
            </Heading>
            <Text color="whiteAlpha.800" fontSize={{ base: "md", md: "lg" }}>
              Pick a style, tap Get Advice, and you will get one clear idea, one next step, and one question to help you follow through.
            </Text>
          </Stack>
          <SimpleGrid columns={3} gap={3} w={{ base: "100%", lg: "auto" }} minW={{ lg: "24rem" }}>
            <Box bg="whiteAlpha.120" p={4} borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300">
              <Text fontSize="xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="0.08em">
                Days used
              </Text>
              <Text fontSize="2xl" fontWeight="700">
                {snapshotStats.streakDays}
              </Text>
            </Box>
            <Box bg="whiteAlpha.120" p={4} borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300">
              <Text fontSize="xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="0.08em">
                Advice cards
              </Text>
              <Text fontSize="2xl" fontWeight="700">
                {snapshotStats.totalGenerations}
              </Text>
            </Box>
            <Box bg="whiteAlpha.120" p={4} borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300">
              <Text fontSize="xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="0.08em">
                Saved ideas
              </Text>
              <Text fontSize="2xl" fontWeight="700">
                {snapshotStats.savedCount}
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>

        <SimpleGrid columns={{ base: 1, xl: 5 }} gap={6}>
          <Stack gap={4} gridColumn={{ xl: "span 2" }}>
            <Box bg="whiteAlpha.100" borderRadius="panel" p={5} borderWidth="1px" borderColor="whiteAlpha.300">
              <Text fontSize="sm" color="whiteAlpha.800" mb={3}>
                Advice style
              </Text>
              <Stack gap={3}>
                {toneProfiles.map((tone) => (
                  <Button
                    key={tone.id}
                    justifyContent="space-between"
                    variant={tone.id === toneProfile ? "solid" : "outline"}
                    bg={tone.id === toneProfile ? "reactor.500" : "transparent"}
                    color={tone.id === toneProfile ? "white" : "whiteAlpha.900"}
                    borderColor="whiteAlpha.300"
                    onClick={() => setToneProfile(tone.id)}
                    px={4}
                    py={6}
                    borderRadius="xl"
                    _hover={{ borderColor: "reactor.300", bg: tone.id === toneProfile ? "reactor.400" : "whiteAlpha.150" }}
                    _focusVisible={{ outline: "2px solid", outlineColor: "ember.300" }}
                    aria-label={`Set advice style to ${tone.label}`}
                  >
                    <Box textAlign="left">
                      <Text fontWeight="700">{tone.label}</Text>
                      <Text fontSize="sm" color={tone.id === toneProfile ? "whiteAlpha.900" : "whiteAlpha.700"}>
                        {tone.hint}
                      </Text>
                    </Box>
                    <Icon as={tone.id === toneProfile ? FiCompass : FiArrowRight} />
                  </Button>
                ))}
              </Stack>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Button size="lg" bg="ember.500" color="white" onClick={handleGenerate} _hover={{ bg: "ember.400" }} _focusVisible={{ outline: "2px solid", outlineColor: "ember.200" }}>
                <HStack>
                  <Icon as={FiRefreshCw} />
                  <Text>Get Advice</Text>
                </HStack>
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="whiteAlpha.400"
                onClick={handleSave}
                disabled={!adviceCard}
                _hover={{ bg: "whiteAlpha.150" }}
              >
                <HStack>
                  <Icon as={FiBookmark} />
                  <Text>Save This</Text>
                </HStack>
              </Button>
            </SimpleGrid>

            <Button variant="ghost" justifyContent="flex-start" color="whiteAlpha.900" onClick={handleShare} disabled={!adviceCard} _hover={{ bg: "whiteAlpha.150" }}>
              <HStack>
                <Icon as={FiShare2} />
                <Text>Share This Advice</Text>
              </HStack>
            </Button>
          </Stack>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ gridColumn: "span 3" }}
          >
            <Box
              bg="linear-gradient(135deg, rgba(20,34,72,0.88), rgba(23,17,54,0.9))"
              borderRadius="1.4rem"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              p={{ base: 5, md: 8 }}
              minH="24rem"
              aria-live="polite"
            >
              {adviceMutation.isPending ? (
                <Stack h="100%" justify="center" align="center" gap={4}>
                  <Spinner size="lg" color="ember.300" />
                  <Text color="whiteAlpha.800">Finding your next useful step...</Text>
                </Stack>
              ) : null}

              {adviceMutation.isError ? (
                <Stack h="100%" justify="center" gap={4}>
                  <Heading as="h2" fontSize="2xl">
                    Advice is taking a moment
                  </Heading>
                  <Text color="whiteAlpha.800">We could not reach live advice sources right now. Try again and we will use backup guidance if needed.</Text>
                  <Button alignSelf="flex-start" onClick={handleGenerate} bg="reactor.500">
                    <HStack>
                      <Icon as={FiRefreshCw} />
                      <Text>Retry now</Text>
                    </HStack>
                  </Button>
                </Stack>
              ) : null}

              {!adviceMutation.isPending && !adviceMutation.isError && adviceCard ? (
                <Stack gap={6}>
                  <HStack wrap="wrap" gap={2}>
                    <Badge bg="reactor.500" color="white" borderRadius="full" px={3} py={1}>
                      {getToneProfileLabel(adviceCard.toneProfile)}
                    </Badge>
                    <Badge bg="whiteAlpha.200" color="white">
                      {adviceFitLabel}
                    </Badge>
                    {adviceSignalLabel ? (
                      <Badge bg="ember.600" color="white">
                        {adviceSignalLabel}
                      </Badge>
                    ) : null}
                  </HStack>
                  <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1.06">
                    {adviceCard.headline}
                  </Heading>
                  <Text fontSize={{ base: "lg", md: "2xl" }} lineHeight="1.4" color="whiteAlpha.950">
                    {adviceCard.advice}
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box bg="whiteAlpha.120" borderRadius="xl" p={4}>
                      <Text fontSize="xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="0.08em" mb={1}>
                        Try this next
                      </Text>
                      <Text color="whiteAlpha.900">{adviceCard.microAction}</Text>
                    </Box>
                    <Box bg="whiteAlpha.120" borderRadius="xl" p={4}>
                      <Text fontSize="xs" color="whiteAlpha.700" textTransform="uppercase" letterSpacing="0.08em" mb={1}>
                        Think about this
                      </Text>
                      <Text color="whiteAlpha.900">{adviceCard.reflectionPrompt}</Text>
                    </Box>
                  </SimpleGrid>
                </Stack>
              ) : null}

              {!adviceMutation.isPending && !adviceMutation.isError && !adviceCard ? (
                <Stack h="100%" justify="center" align="flex-start" gap={4}>
                  <Heading as="h2" fontSize="2xl">
                    Ready when you are
                  </Heading>
                  <Text color="whiteAlpha.800">Pick an advice style and press Get Advice.</Text>
                </Stack>
              ) : null}
            </Box>
          </motion.div>
        </SimpleGrid>

        {statusMessage ? (
          <Box bg="green.700" color="white" borderRadius="xl" px={4} py={3} role="status">
            {statusMessage}
          </Box>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <NextLink href="/momentum">
            <Box
              borderRadius="panel"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              bg="whiteAlpha.120"
              p={5}
              _hover={{ bg: "whiteAlpha.180", borderColor: "reactor.300" }}
            >
              <HStack color="reactor.100" mb={2}>
                <Icon as={FiTrendingUp} />
                <Text fontWeight="700">Progress</Text>
              </HStack>
              <Text color="whiteAlpha.800">Review recent advice and save short notes about what worked.</Text>
            </Box>
          </NextLink>

          <NextLink href="/library">
            <Box
              borderRadius="panel"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              bg="whiteAlpha.120"
              p={5}
              _hover={{ bg: "whiteAlpha.180", borderColor: "ember.300" }}
            >
              <HStack color="ember.100" mb={2}>
                <Icon as={FiBookmark} />
                <Text fontWeight="700">Saved Advice</Text>
              </HStack>
              <Text color="whiteAlpha.800">Keep the advice you want to revisit later.</Text>
            </Box>
          </NextLink>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
