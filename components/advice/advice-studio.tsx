"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
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
  Textarea,
} from "@chakra-ui/react";
import { FiArchive, FiBookmark, FiClock, FiRefreshCw, FiSend, FiShare2 } from "react-icons/fi";
import {
  adviceRequestSchema,
  adviceResponseSchema,
  type AdviceBlockVM,
  type AdviceDetail,
  type AdviceIntent,
  type AdviceRequestVM,
  type AdviceResponseVM,
  type AdviceStyle,
} from "@/features/advice/contracts";
import {
  getAdviceBlockTitle,
  getAdviceFitLabel,
  getAdviceSignalLabel,
  getDetailLabel,
  getIntentLabel,
  getStyleLabel,
} from "@/features/advice/presentation";
import {
  createShareCard,
  getRecentHashes,
  getWorkspaceState,
  isCardSaved,
  recordGeneratedAdvice,
  saveAdviceCard,
  updateWorkspacePreferences,
} from "@/features/workspace/storage";

const intentOptions: AdviceIntent[] = ["general", "quick", "decision", "communication", "planning", "stress"];
const styleOptions: AdviceStyle[] = ["balanced", "direct", "supportive", "creative"];
const detailOptions: AdviceDetail[] = ["short", "standard", "deep"];

interface WorkspaceSnapshot {
  historyCount: number;
  savedCount: number;
}

function blockKey(block: AdviceBlockVM, index: number): string {
  if (block.type === "steps" || block.type === "checklist") {
    return `${block.type}:${index}:${block.items.join("|")}`;
  }

  return `${block.type}:${index}:${block.text}`;
}

async function fetchAdvice(request: AdviceRequestVM): Promise<AdviceResponseVM> {
  const response = await fetch("/api/advice", {
    method: "POST",
    cache: "no-store",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error ?? "Advice request failed");
  }

  const parsed = adviceResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Advice payload failed validation");
  }

  return parsed.data;
}

export function AdviceStudio() {
  const router = useRouter();

  const [latestResponse, setLatestResponse] = useState<AdviceResponseVM | null>(null);
  const [contextDraft, setContextDraft] = useState("");
  const [intent, setIntent] = useState<AdviceIntent>("general");
  const [style, setStyle] = useState<AdviceStyle>("balanced");
  const [detail, setDetail] = useState<AdviceDetail>("standard");
  const [recentHashes, setRecentHashes] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>({
    historyCount: 0,
    savedCount: 0,
  });

  const lastRecordedIdRef = useRef<string | null>(null);

  useEffect(() => {
    const state = getWorkspaceState();
    setIntent(state.preferences.lastIntent);
    setStyle(state.preferences.lastStyle);
    setDetail(state.preferences.lastDetail);
    setContextDraft(state.preferences.contextDraft ?? "");
    setRecentHashes(getRecentHashes());
    setSnapshot({
      historyCount: state.history.length,
      savedCount: state.savedCards.length,
    });
  }, []);

  const adviceMutation = useMutation({
    mutationFn: (request: AdviceRequestVM) => fetchAdvice(request),
    onSuccess: (payload) => {
      setLatestResponse(payload);

      if (lastRecordedIdRef.current === payload.card.id) {
        return;
      }

      lastRecordedIdRef.current = payload.card.id;
      const nextState = recordGeneratedAdvice(payload.card);
      setRecentHashes(getRecentHashes());
      setSnapshot({
        historyCount: nextState.history.length,
        savedCount: nextState.savedCards.length,
      });
    },
  });

  const latestCard = latestResponse?.card;
  const cardSaved = latestCard ? isCardSaved(latestCard) : false;

  function buildRequestPayload(): AdviceRequestVM {
    return adviceRequestSchema.parse({
      context: contextDraft,
      intent,
      style,
      detail,
      avoidRecentHashes: recentHashes,
    });
  }

  function handleGenerate() {
    setStatusMessage(null);
    const payload = buildRequestPayload();
    updateWorkspacePreferences({
      intent: payload.intent,
      style: payload.style,
      detail: payload.detail,
      contextDraft: payload.context ?? "",
    });
    adviceMutation.mutate(payload);
  }

  function handleSave() {
    if (!latestCard) {
      return;
    }

    const nextState = saveAdviceCard(latestCard);
    setSnapshot((prev) => ({ ...prev, savedCount: nextState.savedCards.length }));
    setStatusMessage("Saved. You can find it in Saved advice.");
  }

  function handleShare() {
    if (!latestCard) {
      return;
    }

    const shareCard = createShareCard(latestCard);
    router.push(`/share/${shareCard.id}` as Route);
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
            <Badge alignSelf="flex-start" bg="utility.600" color="white" px={3} py={1} borderRadius="full">
              Advicely v5
            </Badge>
            <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.05" color="gray.900">
              Practical advice you can use right now
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              One tap works with no context. Add details when you want a more tailored answer.
            </Text>
          </Stack>

          <SimpleGrid columns={2} gap={3} w={{ base: "100%", lg: "auto" }} minW={{ lg: "20rem" }}>
            <Box bg="white" p={4} borderRadius="panel" borderWidth="1px" borderColor="gray.200" shadow="sm">
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em">
                History
              </Text>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {snapshot.historyCount}
              </Text>
            </Box>
            <Box bg="white" p={4} borderRadius="panel" borderWidth="1px" borderColor="gray.200" shadow="sm">
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em">
                Saved
              </Text>
              <Text fontSize="2xl" fontWeight="700" color="gray.800">
                {snapshot.savedCount}
              </Text>
            </Box>
          </SimpleGrid>
        </Flex>

        <SimpleGrid columns={{ base: 1, xl: 5 }} gap={6}>
          <Stack gap={4} gridColumn={{ xl: "span 2" }}>
            <Box bg="white" borderRadius="panel" p={5} borderWidth="1px" borderColor="gray.200" shadow="sm">
              <Stack gap={4}>
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    What are you dealing with? (optional)
                  </Text>
                  <Textarea
                    aria-label="Advice context"
                    placeholder="Example: I need to decline extra work without hurting the relationship."
                    value={contextDraft}
                    onChange={(event) => setContextDraft(event.currentTarget.value)}
                    minH="7rem"
                    bg="gray.50"
                    borderColor="gray.300"
                    color="gray.800"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Advice type
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
                    {intentOptions.map((option) => (
                      <Button
                        key={option}
                        size="sm"
                        variant={option === intent ? "solid" : "outline"}
                        bg={option === intent ? "utility.600" : "white"}
                        color={option === intent ? "white" : "gray.700"}
                        borderColor="gray.300"
                        onClick={() => setIntent(option)}
                        aria-label={`Set intent to ${getIntentLabel(option)}`}
                      >
                        {getIntentLabel(option)}
                      </Button>
                    ))}
                  </SimpleGrid>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Tone
                    </Text>
                    <SimpleGrid columns={2} gap={2}>
                      {styleOptions.map((option) => (
                        <Button
                          key={option}
                          size="sm"
                          variant={option === style ? "solid" : "outline"}
                          bg={option === style ? "utility.600" : "white"}
                          color={option === style ? "white" : "gray.700"}
                          borderColor="gray.300"
                          onClick={() => setStyle(option)}
                          aria-label={`Set style to ${getStyleLabel(option)}`}
                        >
                          {getStyleLabel(option)}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Detail
                    </Text>
                    <SimpleGrid columns={3} gap={2}>
                      {detailOptions.map((option) => (
                        <Button
                          key={option}
                          size="sm"
                          variant={option === detail ? "solid" : "outline"}
                          bg={option === detail ? "utility.600" : "white"}
                          color={option === detail ? "white" : "gray.700"}
                          borderColor="gray.300"
                          onClick={() => setDetail(option)}
                          aria-label={`Set detail to ${getDetailLabel(option)}`}
                        >
                          {getDetailLabel(option)}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>
                </SimpleGrid>
              </Stack>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Button
                size="lg"
                bg="signal.600"
                color="white"
                onClick={handleGenerate}
                _hover={{ bg: "signal.500" }}
                _focusVisible={{ outline: "2px solid", outlineColor: "signal.300" }}
              >
                <HStack>
                  <Icon as={FiRefreshCw} />
                  <Text>Generate Advice</Text>
                </HStack>
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="gray.800"
                borderColor="gray.300"
                onClick={handleSave}
                disabled={!latestCard || cardSaved}
                _hover={{ bg: "gray.100" }}
              >
                <HStack>
                  <Icon as={FiBookmark} />
                  <Text>{cardSaved ? "Already Saved" : "Save Advice"}</Text>
                </HStack>
              </Button>
            </SimpleGrid>

            <Button
              variant="ghost"
              justifyContent="flex-start"
              color="gray.800"
              onClick={handleShare}
              disabled={!latestCard}
              _hover={{ bg: "gray.100" }}
            >
              <HStack>
                <Icon as={FiShare2} />
                <Text>Create Share Card</Text>
              </HStack>
            </Button>
          </Stack>

          <Box
            bg="white"
            borderRadius="1.4rem"
            borderWidth="1px"
            borderColor="gray.200"
            p={{ base: 5, md: 8 }}
            minH="24rem"
            gridColumn={{ xl: "span 3" }}
            shadow="sm"
            aria-live="polite"
          >
            {adviceMutation.isPending ? (
              <Stack h="100%" justify="center" align="center" gap={4}>
                <Spinner size="lg" color="signal.500" />
                <Text color="gray.600">Generating advice...</Text>
              </Stack>
            ) : null}

            {adviceMutation.isError ? (
              <Stack h="100%" justify="center" gap={4}>
                <Heading as="h2" fontSize="2xl" color="gray.800">
                  Advice is unavailable right now
                </Heading>
                <Text color="gray.600">Live sources failed on this request. Try again in a moment.</Text>
                <Button alignSelf="flex-start" onClick={handleGenerate} bg="utility.600" color="white">
                  <HStack>
                    <Icon as={FiRefreshCw} />
                    <Text>Retry</Text>
                  </HStack>
                </Button>
              </Stack>
            ) : null}

            {!adviceMutation.isPending && !adviceMutation.isError && latestCard ? (
              <Stack gap={5}>
                <HStack wrap="wrap" gap={2}>
                  <Badge bg="utility.600" color="white" borderRadius="full" px={3} py={1}>
                    {getIntentLabel(latestCard.intent)}
                  </Badge>
                  <Badge bg="gray.100" color="gray.700">
                    {getStyleLabel(latestCard.style)}
                  </Badge>
                  <Badge bg="gray.100" color="gray.700">
                    {getDetailLabel(latestCard.detail)}
                  </Badge>
                  <Badge bg="gray.100" color="gray.700">
                    {getAdviceFitLabel(latestCard.confidence)}
                  </Badge>
                  {getAdviceSignalLabel(latestCard.errorState, latestCard.fallbackUsed) ? (
                    <Badge bg="signal.100" color="signal.900">
                      {getAdviceSignalLabel(latestCard.errorState, latestCard.fallbackUsed)}
                    </Badge>
                  ) : null}
                </HStack>

                <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1.06" color="gray.800">
                  {latestCard.headline}
                </Heading>

                <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.5" color="gray.700">
                  {latestCard.summary}
                </Text>

                <Stack gap={4}>
                  {latestCard.blocks.map((block, index) => (
                    <Box key={blockKey(block, index)} bg="gray.50" borderRadius="xl" p={4} borderWidth="1px" borderColor="gray.200">
                      <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                        {getAdviceBlockTitle(block.type)}
                      </Text>

                      {block.type === "steps" || block.type === "checklist" ? (
                        <Stack as="ul" gap={2} pl={4} m={0}>
                          {block.items.map((item) => (
                            <Text as="li" key={`${block.type}-${item}`} color="gray.800">
                              {item}
                            </Text>
                          ))}
                        </Stack>
                      ) : (
                        <Text color="gray.800">{block.text}</Text>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Stack>
            ) : null}

            {!adviceMutation.isPending && !adviceMutation.isError && !latestCard ? (
              <Stack h="100%" justify="center" align="flex-start" gap={4}>
                <Heading as="h2" fontSize="2xl" color="gray.800">
                  Ready to generate
                </Heading>
                <Text color="gray.600">Leave context blank for a quick answer, or add context for tailored advice.</Text>
              </Stack>
            ) : null}
          </Box>
        </SimpleGrid>

        {statusMessage ? (
          <Box bg="green.100" color="green.900" borderRadius="xl" px={4} py={3} role="status" borderWidth="1px" borderColor="green.200">
            {statusMessage}
          </Box>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <NextLink href="/history">
            <Box
              borderRadius="panel"
              borderWidth="1px"
              borderColor="gray.200"
              bg="white"
              p={5}
              _hover={{ bg: "gray.50", borderColor: "utility.300" }}
              shadow="sm"
            >
              <HStack color="utility.700" mb={2}>
                <Icon as={FiClock} />
                <Text fontWeight="700">History</Text>
              </HStack>
              <Text color="gray.600">Review recent generations and save anything worth reusing.</Text>
            </Box>
          </NextLink>

          <NextLink href="/saved">
            <Box
              borderRadius="panel"
              borderWidth="1px"
              borderColor="gray.200"
              bg="white"
              p={5}
              _hover={{ bg: "gray.50", borderColor: "signal.300" }}
              shadow="sm"
            >
              <HStack color="signal.700" mb={2}>
                <Icon as={FiArchive} />
                <Text fontWeight="700">Saved</Text>
              </HStack>
              <Text color="gray.600">Search and manage advice cards you want to keep close.</Text>
            </Box>
          </NextLink>
        </SimpleGrid>

        <Box bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={4} shadow="sm">
          <HStack gap={3}>
            <Icon as={FiSend} color="utility.700" />
            <Text color="gray.700">Tip: two sentences of context usually gives the best guidance.</Text>
          </HStack>
        </Box>
      </Stack>
    </Container>
  );
}
