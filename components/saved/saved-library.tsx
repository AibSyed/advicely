"use client";

import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Heading, HStack, Icon, Input, SimpleGrid, Stack, Text, Textarea } from "@chakra-ui/react";
import { FiSearch, FiShare2, FiTrash2 } from "react-icons/fi";
import { RouteLink } from "@/components/route-link";
import { SourceCardView } from "@/components/source-card";
import type { DrawSource, SourceCardKind } from "@/features/draw/contracts";
import type { SavedCardVM } from "@/features/library/contracts";
import { createShareCard, getLibraryState, removeSavedCard, updateSavedCardNote } from "@/features/library/storage";

function matchesQuery(card: SavedCardVM, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [card.text, card.author ?? "", card.sourceLabel, card.note ?? ""].some((value) => value.toLowerCase().includes(normalized));
}

export function SavedLibrary() {
  const router = useRouter();
  const [savedCards, setSavedCards] = useState<SavedCardVM[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | SourceCardKind>("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | DrawSource>("all");

  useEffect(() => {
    setSavedCards(getLibraryState().savedCards);
  }, []);

  const filteredCards = useMemo(
    () =>
      savedCards
        .filter((card) => (kindFilter === "all" ? true : card.kind === kindFilter))
        .filter((card) => (sourceFilter === "all" ? true : card.source === sourceFilter))
        .filter((card) => matchesQuery(card, searchQuery)),
    [savedCards, kindFilter, searchQuery, sourceFilter],
  );

  function handleRemove(cardId: string) {
    const nextState = removeSavedCard(cardId);
    setSavedCards(nextState.savedCards);
  }

  function handleShare(card: SavedCardVM) {
    const shareCard = createShareCard(card, card.note);
    router.push(`/share/${shareCard.id}` as Route);
  }

  function handleNoteChange(cardId: string, note: string) {
    const nextState = updateSavedCardNote(cardId, note);
    setSavedCards(nextState.savedCards);
  }

  return (
    <Container maxW="7xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <HStack wrap="wrap" gap={3}>
          <RouteLink href="/">Back to draw deck</RouteLink>
          <RouteLink href="/history">History</RouteLink>
          <RouteLink href="/sources">Sources</RouteLink>
        </HStack>

        <Stack gap={3} maxW="3xl">
          <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.96">
            Saved cards
          </Heading>
          <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
            Keep the cards worth revisiting, add a personal note, and search by text, author, or your own memory cue.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          <HStack bg="rgba(255, 250, 240, 0.92)" p={4} borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" shadow="float">
            <Icon as={FiSearch} color="ink.500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              placeholder="Search saved cards or notes"
              aria-label="Search saved cards"
              bg="rgba(255,255,255,0.7)"
              borderColor="rgba(54, 46, 34, 0.14)"
            />
          </HStack>

          <SimpleGrid columns={2} gap={3}>
            <Box bg="rgba(255, 250, 240, 0.92)" p={4} borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" shadow="float">
              <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>Kind</Text>
              <HStack gap={2} wrap="wrap">
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
            <Box bg="rgba(255, 250, 240, 0.92)" p={4} borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" shadow="float">
              <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>Source</Text>
              <HStack gap={2} wrap="wrap">
                {(["all", "advice_slip", "zen_quotes", "local_collection"] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={sourceFilter === filter ? "solid" : "outline"}
                    bg={sourceFilter === filter ? "accent.700" : "rgba(255,255,255,0.7)"}
                    color={sourceFilter === filter ? "paper.50" : "ink.700"}
                    borderColor="rgba(54, 46, 34, 0.14)"
                    onClick={() => setSourceFilter(filter)}
                  >
                    {filter === "all"
                      ? "All"
                      : filter === "advice_slip"
                        ? "AdviceSlip"
                        : filter === "zen_quotes"
                          ? "ZenQuotes"
                          : "Collection"}
                  </Button>
                ))}
              </HStack>
            </Box>
          </SimpleGrid>
        </SimpleGrid>

        {filteredCards.length === 0 ? (
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={8} shadow="float">
            <Heading as="h2" size="lg" color="ink.800">No saved cards in this view</Heading>
            <Text mt={2} color="ink.600">Clear a filter or save a new card from the draw deck.</Text>
          </Box>
        ) : null}

        <Stack gap={5}>
          {filteredCards.map((card) => (
            <SourceCardView
              key={card.id}
              card={card}
              note={card.note}
              compact
              footer={
                <Stack gap={4}>
                  <Text color="ink.500" fontSize="sm">
                    Saved {new Date(card.savedAt).toLocaleString()} · {card.sourceLabel}
                  </Text>
                  <Box>
                    <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>
                      Edit local note
                    </Text>
                    <Textarea
                      value={card.note ?? ""}
                      onChange={(event) => handleNoteChange(card.id, event.currentTarget.value.slice(0, 320))}
                      placeholder="Why this card matters to you"
                      minH="6.5rem"
                      bg="rgba(255,255,255,0.72)"
                      borderColor="rgba(54, 46, 34, 0.14)"
                      aria-label={`Edit note for ${card.text}`}
                    />
                  </Box>
                  <HStack wrap="wrap" gap={3}>
                    <Button size="sm" bg="accent.700" color="paper.50" onClick={() => handleShare(card)}>
                      <HStack>
                        <Icon as={FiShare2} />
                        <Text>Share</Text>
                      </HStack>
                    </Button>
                    <Button size="sm" variant="outline" borderColor="rgba(54, 46, 34, 0.18)" onClick={() => handleRemove(card.id)}>
                      <HStack>
                        <Icon as={FiTrash2} />
                        <Text>Remove</Text>
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
