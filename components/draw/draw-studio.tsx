"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
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
  Textarea,
} from "@chakra-ui/react";
import { FiArchive, FiBookOpen, FiBookmark, FiRefreshCw, FiShare2 } from "react-icons/fi";
import { RouteLink } from "@/components/route-link";
import { SourceCardView } from "@/components/source-card";
import {
  drawRequestSchema,
  drawResponseSchema,
  type DrawMode,
  type DrawRequestVM,
  type DrawResponseVM,
} from "@/features/draw/contracts";
import { getModeDescription, getModeLabel } from "@/features/draw/presentation";
import {
  createShareCard,
  findSavedCardByHash,
  getLibraryState,
  getRecentHashes,
  isCardSaved,
  recordDrawnCard,
  saveCard,
  updatePreferences,
} from "@/features/library/storage";

const modeOptions: DrawMode[] = ["mixed", "advice", "quote"];

interface LibrarySnapshot {
  historyCount: number;
  savedCount: number;
}

async function fetchDraw(request: DrawRequestVM): Promise<DrawResponseVM> {
  const response = await fetch("/api/draw", {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error ?? "Draw request failed");
  }

  const parsed = drawResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Draw payload failed validation");
  }

  return parsed.data;
}

export function DrawStudio() {
  const router = useRouter();
  const [mode, setMode] = useState<DrawMode>("mixed");
  const [latestResponse, setLatestResponse] = useState<DrawResponseVM | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<LibrarySnapshot>({ historyCount: 0, savedCount: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const state = getLibraryState();
    setMode(state.preferences.lastMode);
    setSnapshot({
      historyCount: state.history.length,
      savedCount: state.savedCards.length,
    });
  }, []);

  const latestCard = latestResponse?.card ?? null;
  const savedCard = useMemo(() => (latestCard ? findSavedCardByHash(latestCard.textHash) : undefined), [latestCard]);
  const cardSaved = latestCard ? isCardSaved(latestCard) : false;

  useEffect(() => {
    if (!latestCard) {
      setNoteDraft("");
      return;
    }

    setNoteDraft(savedCard?.note ?? "");
  }, [latestCard, savedCard]);

  async function handleDraw() {
    setStatusMessage(null);
    setIsLoading(true);
    updatePreferences(mode);

    try {
      const payload = drawRequestSchema.parse({
        mode,
        avoidRecentHashes: getRecentHashes(),
      });
      const response = await fetchDraw(payload);
      const nextState = recordDrawnCard(response.card);

      setLatestResponse(response);
      setSnapshot({
        historyCount: nextState.history.length,
        savedCount: nextState.savedCards.length,
      });
      setStatusMessage(response.card.provenance === "live" ? "New card drawn." : "New fallback card drawn.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Could not draw a new card right now.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSave() {
    if (!latestCard) {
      return;
    }

    const nextState = saveCard(latestCard, noteDraft);
    setSnapshot((current) => ({ ...current, savedCount: nextState.savedCards.length }));
    setStatusMessage(cardSaved ? "Saved note updated." : "Card saved to your library.");
  }

  function handleShare() {
    if (!latestCard) {
      return;
    }

    const shareCard = createShareCard(latestCard, savedCard?.note ?? noteDraft);
    router.push(`/share/${shareCard.id}` as Route);
  }

  return (
    <Container maxW="7xl" py={{ base: 6, md: 10 }}>
      <Stack gap={{ base: 6, md: 8 }}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <Stack gap={3} maxW="3xl">
            <Badge alignSelf="flex-start" bg="ink.800" color="paper.50" px={3} py={1} borderRadius="full">
              Advicely v6
            </Badge>
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.95">
              Random advice and quotes, clearly sourced.
            </Heading>
            <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
              Draw from live public sources, save what resonates, and keep private notes in this browser only.
            </Text>
            <HStack wrap="wrap" gap={2}>
              <Badge bg="paper.200" color="ink.700">Random sources</Badge>
              <Badge bg="accent.100" color="accent.800">Local notes only</Badge>
              <Badge bg="ember.100" color="ember.800">Clear attribution</Badge>
            </HStack>
          </Stack>

          <HStack wrap="wrap" gap={3}>
            <RouteLink href="/saved">Saved</RouteLink>
            <RouteLink href="/history">History</RouteLink>
            <RouteLink href="/sources">Sources</RouteLink>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, xl: 5 }} gap={6}>
          <Stack gap={5} gridColumn={{ xl: "span 2" }}>
            <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={5} shadow="float">
              <Stack gap={4}>
                <Box>
                  <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={3}>
                    Draw mode
                  </Text>
                  <Stack gap={3}>
                    {modeOptions.map((option) => (
                      <Button
                        key={option}
                        justifyContent="space-between"
                        minH="4.5rem"
                        whiteSpace="normal"
                        variant={mode === option ? "solid" : "outline"}
                        bg={mode === option ? "accent.700" : "rgba(255, 255, 255, 0.7)"}
                        color={mode === option ? "paper.50" : "ink.700"}
                        borderColor="rgba(54, 46, 34, 0.16)"
                        onClick={() => setMode(option)}
                      >
                        <Stack align="flex-start" gap={1} textAlign="left">
                          <Text fontWeight="700">{getModeLabel(option)}</Text>
                          <Text fontSize="sm" opacity={0.88}>{getModeDescription(option)}</Text>
                        </Stack>
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <SimpleGrid columns={2} gap={3}>
                  <Box bg="rgba(255,255,255,0.66)" borderRadius="1rem" p={4} borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)">
                    <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color="ink.500">History</Text>
                    <Text fontSize="3xl" fontWeight="700" color="ink.800">{snapshot.historyCount}</Text>
                  </Box>
                  <Box bg="rgba(255,255,255,0.66)" borderRadius="1rem" p={4} borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)">
                    <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color="ink.500">Saved</Text>
                    <Text fontSize="3xl" fontWeight="700" color="ink.800">{snapshot.savedCount}</Text>
                  </Box>
                </SimpleGrid>

                <Button
                  size="lg"
                  bg="ink.800"
                  color="paper.50"
                  onClick={handleDraw}
                  _hover={{ bg: "ink.700" }}
                  _focusVisible={{ outline: "2px solid", outlineColor: "accent.400" }}
                  disabled={isLoading}
                >
                  <HStack>
                    {isLoading ? <Spinner size="sm" color="paper.50" /> : <Icon as={FiRefreshCw} />}
                    <Text>{isLoading ? "Drawing..." : "Draw card"}</Text>
                  </HStack>
                </Button>

                <Text color="ink.600" fontSize="sm">
                  Advicely does not tailor provider output to your situation. The value here is honest sourcing, curation, and local notes.
                </Text>
              </Stack>
            </Box>

            <Box bg="rgba(255, 250, 240, 0.84)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.1)" p={5}>
              <Stack gap={3}>
                <HStack gap={3} color="ink.600">
                  <Icon as={FiArchive} />
                  <Text>Notes and saved cards stay in this browser.</Text>
                </HStack>
                <HStack gap={3} color="ink.600">
                  <Icon as={FiBookOpen} />
                  <Text>Fallback cards are labeled clearly when live sources fail or repeat.</Text>
                </HStack>
              </Stack>
            </Box>
          </Stack>

          <Stack gap={5} gridColumn={{ xl: "span 3" }}>
            {latestCard ? (
              <SourceCardView
                card={latestCard}
                footer={
                  <Stack gap={4}>
                    <Text color="ink.500" fontSize="sm">
                      Source: {latestCard.sourceLabel} · Drawn {new Date(latestCard.drawnAt).toLocaleString()}
                    </Text>
                    <Box>
                      <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>
                        Why this mattered to me (optional)
                      </Text>
                      <Textarea
                        value={noteDraft}
                        onChange={(event) => setNoteDraft(event.currentTarget.value.slice(0, 320))}
                        placeholder="This note stays in your browser and is not sent to any source."
                        minH="7rem"
                        bg="rgba(255,255,255,0.72)"
                        borderColor="rgba(54, 46, 34, 0.14)"
                        color="ink.800"
                        aria-label="Optional personal note"
                      />
                    </Box>
                    <HStack wrap="wrap" gap={3}>
                      <Button bg="accent.700" color="paper.50" onClick={handleSave} _hover={{ bg: "accent.600" }}>
                        <HStack>
                          <Icon as={FiBookmark} />
                          <Text>{cardSaved ? "Update saved card" : "Save to library"}</Text>
                        </HStack>
                      </Button>
                      <Button variant="outline" borderColor="rgba(54, 46, 34, 0.18)" color="ink.800" onClick={handleShare}>
                        <HStack>
                          <Icon as={FiShare2} />
                          <Text>Create share card</Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </Stack>
                }
              />
            ) : (
              <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={{ base: 6, md: 8 }} shadow="float">
                <Stack gap={4}>
                  <Badge alignSelf="flex-start" bg="paper.200" color="ink.700">Ready to draw</Badge>
                  <Heading as="h2" fontSize={{ base: "3xl", md: "5xl" }} color="ink.800" lineHeight="1">
                    Nothing has been drawn yet.
                  </Heading>
                  <Text color="ink.600" fontSize={{ base: "md", md: "lg" }} maxW="2xl">
                    Mixed mode alternates between live advice and live quotes. Advice mode uses AdviceSlip. Quote mode uses ZenQuotes. If a live result fails, Advicely falls back to its own clearly labeled collection.
                  </Text>
                </Stack>
              </Box>
            )}

            <Box role="status" aria-live="polite" minH="1.5rem">
              {statusMessage ? <Text color="ink.600">{statusMessage}</Text> : null}
            </Box>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
