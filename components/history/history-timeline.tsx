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
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiBookmark, FiCornerUpLeft, FiSearch, FiShare2 } from "react-icons/fi";
import type { AdviceCardVM } from "@/features/advice/contracts";
import {
  getDetailLabel,
  getIntentLabel,
  getSourceLabel,
  getStyleLabel,
} from "@/features/advice/presentation";
import {
  createShareCard,
  getWorkspaceState,
  saveAdviceCard,
  updateWorkspacePreferences,
} from "@/features/workspace/storage";

function textFromCard(card: AdviceCardVM): string {
  const blocks = card.blocks
    .flatMap((block) => {
      if ("text" in block) {
        return [block.text];
      }

      return block.items;
    })
    .join(" ")
    .toLowerCase();

  return `${card.headline} ${card.summary} ${blocks}`;
}

export function HistoryTimeline() {
  const router = useRouter();
  const [historyCards, setHistoryCards] = useState<AdviceCardVM[]>([]);
  const [savedHashes, setSavedHashes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const state = getWorkspaceState();
    setHistoryCards(state.history);
    setSavedHashes(new Set(state.savedCards.map((card) => card.textHash)));
  }, []);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) {
      return historyCards;
    }

    const normalized = searchQuery.trim().toLowerCase();
    return historyCards.filter((card) => textFromCard(card).includes(normalized));
  }, [historyCards, searchQuery]);

  function handleSave(card: AdviceCardVM) {
    const nextState = saveAdviceCard(card);
    setSavedHashes(new Set(nextState.savedCards.map((saved) => saved.textHash)));
  }

  function handleReuse(card: AdviceCardVM) {
    updateWorkspacePreferences({
      intent: card.intent,
      style: card.style,
      detail: card.detail,
      contextDraft: card.context ?? "",
    });

    router.push("/" as Route);
  }

  function handleShare(card: AdviceCardVM) {
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
            Advice history
          </Heading>
          <Text color="gray.600" maxW="2xl">
            Reopen anything you generated recently, save it, or share it.
          </Text>
        </Stack>

        <HStack gap={3} bg="white" p={4} borderRadius="panel" borderWidth="1px" borderColor="gray.200" shadow="sm">
          <Icon as={FiSearch} color="gray.500" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            placeholder="Search history"
            aria-label="Search history"
            bg="gray.50"
            borderColor="gray.300"
          />
        </HStack>

        {filteredCards.length === 0 ? (
          <Box bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={8} shadow="sm">
            <Heading as="h2" size="md" color="gray.900">
              No history yet
            </Heading>
            <Text mt={2} color="gray.600">
              Generate advice from the studio to build your history.
            </Text>
          </Box>
        ) : null}

        <Stack gap={4}>
          {filteredCards.map((card) => {
            const saved = savedHashes.has(card.textHash);

            return (
              <Box key={card.id} bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={5} shadow="sm">
                <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
                  <Stack gap={2}>
                    <HStack wrap="wrap" gap={2}>
                      <Badge bg="utility.600" color="white">{getIntentLabel(card.intent)}</Badge>
                      <Badge bg="gray.100" color="gray.700">{getStyleLabel(card.style)}</Badge>
                      <Badge bg="gray.100" color="gray.700">{getDetailLabel(card.detail)}</Badge>
                      <Badge bg="gray.100" color="gray.700">{getSourceLabel(card.source)}</Badge>
                    </HStack>
                    <Heading as="h2" size="md" color="gray.900">
                      {card.headline}
                    </Heading>
                    <Text color="gray.700">{card.summary}</Text>
                    <Text fontSize="xs" color="gray.500">
                      Generated {new Date(card.generatedAt).toLocaleString()}
                    </Text>
                  </Stack>
                </Flex>

                <HStack mt={4} gap={2} wrap="wrap">
                  <Button size="sm" variant="outline" borderColor="gray.300" onClick={() => handleReuse(card)}>
                    <HStack>
                      <Icon as={FiCornerUpLeft} />
                      <Text>Use in Studio</Text>
                    </HStack>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="gray.300"
                    onClick={() => handleSave(card)}
                    disabled={saved}
                  >
                    <HStack>
                      <Icon as={FiBookmark} />
                      <Text>{saved ? "Saved" : "Save"}</Text>
                    </HStack>
                  </Button>
                  <Button size="sm" variant="outline" borderColor="gray.300" onClick={() => handleShare(card)}>
                    <HStack>
                      <Icon as={FiShare2} />
                      <Text>Share</Text>
                    </HStack>
                  </Button>
                </HStack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
}
