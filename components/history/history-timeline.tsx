"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Badge, Box, Button, Container, Heading, HStack, Icon, Input, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiBookmark, FiSearch, FiShare2 } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import type { SourceCardKind, SourceCardVM } from "@/features/draw/contracts";
import { getCardEyebrow } from "@/features/draw/presentation";
import { createShareCard, getLibraryState, saveCard } from "@/features/library/storage";

function matchesQuery(card: SourceCardVM, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [card.text, card.author ?? "", card.sourceLabel, getCardEyebrow(card)].some((value) => value.toLowerCase().includes(normalized));
}

export function HistoryTimeline() {
  const router = useRouter();
  const [historyCards, setHistoryCards] = useState<SourceCardVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | SourceCardKind>("all");
  const [savedHashes, setSavedHashes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const state = getLibraryState();
    setHistoryCards(state.history);
    setSavedHashes(new Set(state.savedCards.map((card) => card.textHash)));
  }, []);

  const filteredCards = useMemo(
    () =>
      historyCards.filter((card) => (kindFilter === "all" ? true : card.kind === kindFilter)).filter((card) => matchesQuery(card, searchQuery)),
    [historyCards, kindFilter, searchQuery],
  );

  function handleSave(card: SourceCardVM) {
    const nextState = saveCard(card);
    setSavedHashes(new Set(nextState.savedCards.map((saved) => saved.textHash)));
  }

  function handleShare(card: SourceCardVM) {
    const shareCard = createShareCard(card);
    router.push(`/share/${shareCard.id}` as Route);
  }

  return (
    <Container maxW="7xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <Stack gap={3} maxW="3xl">
          <Badge alignSelf="flex-start" bg="ink.800" color="paper.50" px={3} py={1} borderRadius="full">
            Recent
          </Badge>
          <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.96">
            Recent draws
          </Heading>
          <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
            A quiet trail of what the deck has surfaced lately. Save anything worth revisiting or share a clean copy with attribution intact.
          </Text>
        </Stack>

        <AppNav />

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4}>
          <HStack bg="rgba(255, 250, 240, 0.92)" p={4} borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" shadow="float" gridColumn={{ lg: "span 2" }}>
            <Icon as={FiSearch} color="ink.500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search text, author, or source"
              aria-label="Search history"
              bg="rgba(255,255,255,0.7)"
              borderColor="rgba(54, 46, 34, 0.14)"
            />
          </HStack>
          <Box bg="rgba(255, 250, 240, 0.92)" p={4} borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" shadow="float">
            <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>
              Filter by type
            </Text>
            <HStack gap={2}>
              {(["all", "advice", "quote"] as const).map((filter) => (
                <Button
                  key={filter}
                  size="sm"
                  variant={kindFilter === filter ? "solid" : "outline"}
                  bg={kindFilter === filter ? "accent.700" : "rgba(255,255,255,0.7)"}
                  color={kindFilter === filter ? "paper.50" : "ink.700"}
                  borderColor="rgba(54, 46, 34, 0.14)"
                  onClick={() => setKindFilter(filter)}
                >
                  {filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </HStack>
          </Box>
        </SimpleGrid>

        {filteredCards.length === 0 ? (
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={8} shadow="float">
            <Heading as="h2" size="lg" color="ink.800">
              No recent draws yet
            </Heading>
            <Text mt={2} color="ink.600">
              Draw a card from the deck to start building a history.
            </Text>
          </Box>
        ) : null}

        <Stack gap={5}>
          {filteredCards.map((card) => (
            <SourceCardView
              key={card.id}
              card={card}
              compact
              footer={
                <Stack gap={3}>
                  <Text color="ink.500" fontSize="sm">
                    {card.sourceLabel} · Drawn {new Date(card.drawnAt).toLocaleString()}
                  </Text>
                  <HStack wrap="wrap" gap={3}>
                    <Button size="sm" bg="accent.700" color="paper.50" onClick={() => handleSave(card)} disabled={savedHashes.has(card.textHash)}>
                      <HStack>
                        <Icon as={FiBookmark} />
                        <Text>{savedHashes.has(card.textHash) ? "Saved" : "Save to library"}</Text>
                      </HStack>
                    </Button>
                    <Button size="sm" variant="outline" borderColor="rgba(54, 46, 34, 0.18)" onClick={() => handleShare(card)}>
                      <HStack>
                        <Icon as={FiShare2} />
                        <Text>Share</Text>
                      </HStack>
                    </Button>
                  </HStack>
                </Stack>
              }
            />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
