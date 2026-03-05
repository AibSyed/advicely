"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import NextLink from "next/link";
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
  Input,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiSearch, FiShare2, FiTrash2 } from "react-icons/fi";
import type { AdviceIntent, AdviceProvider, AdviceStyle } from "@/features/advice/contracts";
import {
  getDetailLabel,
  getIntentLabel,
  getSourceLabel,
  getStyleLabel,
} from "@/features/advice/presentation";
import type { SavedAdviceCardVM } from "@/features/workspace/contracts";
import {
  createShareCard,
  getWorkspaceState,
  removeSavedCard,
} from "@/features/workspace/storage";

type IntentFilter = "all" | AdviceIntent;
type StyleFilter = "all" | AdviceStyle;
type SourceFilter = "all" | AdviceProvider;

const intentFilters: IntentFilter[] = ["all", "quick", "decision", "communication", "planning", "stress", "general"];
const styleFilters: StyleFilter[] = ["all", "balanced", "direct", "supportive", "creative"];
const sourceFilters: SourceFilter[] = ["all", "advice_slip", "zen_quotes", "local_fallback"];

function cardContainsQuery(card: SavedAdviceCardVM, query: string): boolean {
  const normalized = query.toLowerCase();

  if (card.headline.toLowerCase().includes(normalized)) {
    return true;
  }

  if (card.summary.toLowerCase().includes(normalized)) {
    return true;
  }

  return card.blocks.some((block) => {
    if ("text" in block) {
      return block.text.toLowerCase().includes(normalized);
    }

    return block.items.some((item) => item.toLowerCase().includes(normalized));
  });
}

function firstBlockPreview(card: SavedAdviceCardVM): string {
  const firstBlock = card.blocks[0];
  if (!firstBlock) {
    return card.summary;
  }

  if ("text" in firstBlock) {
    return firstBlock.text;
  }

  return firstBlock.items.join(" • ");
}

export function SavedLibrary() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedAdviceCardVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [intentFilter, setIntentFilter] = useState<IntentFilter>("all");
  const [styleFilter, setStyleFilter] = useState<StyleFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    const state = getWorkspaceState();
    setSavedCards(state.savedCards);
  }, []);

  const filteredCards = useMemo(() => {
    return savedCards.filter((card) => {
      if (intentFilter !== "all" && card.intent !== intentFilter) {
        return false;
      }

      if (styleFilter !== "all" && card.style !== styleFilter) {
        return false;
      }

      if (sourceFilter !== "all" && card.source !== sourceFilter) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      return cardContainsQuery(card, searchQuery.trim());
    });
  }, [savedCards, intentFilter, searchQuery, sourceFilter, styleFilter]);

  function handleRemove(cardId: string) {
    const nextState = removeSavedCard(cardId);
    setSavedCards(nextState.savedCards);
  }

  function handleShare(card: SavedAdviceCardVM) {
    const shareCard = createShareCard(card);
    router.push(`/share/${shareCard.id}` as Route);
  }

  return (
    <Container maxW="7xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <NextLink href="/">
          <Button alignSelf="flex-start" variant="ghost" color="gray.800" _hover={{ bg: "gray.100" }}>
            <HStack>
              <Icon as={FiArrowLeft} />
              <Text>Back to studio</Text>
            </HStack>
          </Button>
        </NextLink>

        <Stack gap={2}>
          <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} color="gray.900">
            Saved advice
          </Heading>
          <Text color="gray.600" maxW="2xl">
            Keep your best guidance in one place. Search it fast when life gets noisy.
          </Text>
        </Stack>

        <Stack gap={4} bg="white" p={5} borderRadius="panel" borderWidth="1px" borderColor="gray.200" shadow="sm">
          <HStack gap={3} align="center">
            <Icon as={FiSearch} color="gray.500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search saved advice"
              aria-label="Search saved advice"
              bg="gray.50"
              borderColor="gray.300"
            />
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>
                Advice type
              </Text>
              <select
                aria-label="Filter by advice type"
                value={intentFilter}
                onChange={(event) => setIntentFilter(event.target.value as IntentFilter)}
                style={{
                  width: "100%",
                  borderRadius: "0.75rem",
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#111827",
                  padding: "0.6rem 0.75rem",
                }}
              >
                {intentFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "all" ? "All types" : getIntentLabel(filter)}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>
                Tone
              </Text>
              <select
                aria-label="Filter by tone"
                value={styleFilter}
                onChange={(event) => setStyleFilter(event.target.value as StyleFilter)}
                style={{
                  width: "100%",
                  borderRadius: "0.75rem",
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#111827",
                  padding: "0.6rem 0.75rem",
                }}
              >
                {styleFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "all" ? "All tones" : getStyleLabel(filter)}
                  </option>
                ))}
              </select>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>
                Source
              </Text>
              <select
                aria-label="Filter by source"
                value={sourceFilter}
                onChange={(event) => setSourceFilter(event.target.value as SourceFilter)}
                style={{
                  width: "100%",
                  borderRadius: "0.75rem",
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  color: "#111827",
                  padding: "0.6rem 0.75rem",
                }}
              >
                {sourceFilters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter === "all" ? "All sources" : getSourceLabel(filter)}
                  </option>
                ))}
              </select>
            </Box>
          </SimpleGrid>
        </Stack>

        {filteredCards.length === 0 ? (
          <Box bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={8} shadow="sm">
            <Heading as="h2" size="md" color="gray.900">
              No saved cards match this view
            </Heading>
            <Text mt={2} color="gray.600">
              Try clearing a filter or generate new advice from the studio.
            </Text>
          </Box>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          {filteredCards.map((card) => (
            <Box key={card.id} bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={5} shadow="sm">
              <Flex justify="space-between" align="flex-start" gap={3}>
                <Stack gap={2}>
                  <HStack wrap="wrap" gap={2}>
                    <Badge bg="utility.600" color="white">{getIntentLabel(card.intent)}</Badge>
                    <Badge bg="gray.100" color="gray.700">{getStyleLabel(card.style)}</Badge>
                  </HStack>
                  <Heading as="h2" size="md" color="gray.900">
                    {card.headline}
                  </Heading>
                </Stack>
              </Flex>

              <Text mt={3} color="gray.700">{card.summary}</Text>
              <Text mt={3} color="gray.600" fontSize="sm">{firstBlockPreview(card)}</Text>

              <HStack mt={4} wrap="wrap" gap={2}>
                <Badge bg="gray.100" color="gray.700">{getDetailLabel(card.detail)}</Badge>
                <Badge bg="gray.100" color="gray.700">{getSourceLabel(card.source)}</Badge>
                <Text fontSize="xs" color="gray.500">
                  Saved {new Date(card.savedAt).toLocaleString()}
                </Text>
              </HStack>

              <HStack mt={4} gap={2}>
                <Button size="sm" variant="outline" borderColor="gray.300" onClick={() => handleShare(card)}>
                  <HStack>
                    <Icon as={FiShare2} />
                    <Text>Share</Text>
                  </HStack>
                </Button>
                <Button size="sm" variant="outline" borderColor="gray.300" onClick={() => handleRemove(card.id)}>
                  <HStack>
                    <Icon as={FiTrash2} />
                    <Text>Remove</Text>
                  </HStack>
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
