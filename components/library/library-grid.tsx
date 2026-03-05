"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
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
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiFilter, FiTrash2 } from "react-icons/fi";
import { getAdviceFitLabel, getToneProfileLabel } from "@/features/advice/presentation";
import { getMomentumState, removeSavedCard } from "@/features/momentum/storage";
import { emptyMomentumState, type MomentumStateVM } from "@/features/momentum/contracts";
import type { ToneProfile } from "@/features/advice/contracts";

const toneOptions: Array<ToneProfile | "all"> = ["all", "grounded", "bold", "calm", "playful"];
const toneOptionLabels: Record<ToneProfile | "all", string> = {
  all: "All styles",
  grounded: "Practical",
  bold: "Direct",
  calm: "Calm",
  playful: "Light",
};

export function LibraryGrid() {
  const [state, setState] = useState<MomentumStateVM>(emptyMomentumState);
  const [toneFilter, setToneFilter] = useState<ToneProfile | "all">("all");

  useEffect(() => {
    setState(getMomentumState());
  }, []);

  const filteredCards = useMemo(() => {
    if (toneFilter === "all") {
      return state.savedCards;
    }

    return state.savedCards.filter((card) => card.toneProfile === toneFilter);
  }, [state.savedCards, toneFilter]);

  function handleDelete(cardId: string) {
    const nextState = removeSavedCard(cardId);
    setState(nextState);
  }

  return (
    <Container maxW="6xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <NextLink href="/">
          <Button alignSelf="flex-start" variant="ghost">
            <HStack>
              <Icon as={FiArrowLeft} />
              <Text>Back to advice</Text>
            </HStack>
          </Button>
        </NextLink>

        <Stack gap={2}>
          <Heading as="h1" id="main-content" fontSize={{ base: "3xl", md: "5xl" }}>
            Advice library
          </Heading>
          <Text color="whiteAlpha.800" maxW="2xl">
            Save advice that actually helps, then come back to it when you need it.
          </Text>
        </Stack>

        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          bg="whiteAlpha.120"
          borderRadius="panel"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          p={4}
        >
          <Flex align="center" gap={2} color="whiteAlpha.900">
            <Icon as={FiFilter} />
            <Text fontWeight="600">Style</Text>
          </Flex>
          <select
            value={toneFilter}
            onChange={(event) => setToneFilter(event.target.value as ToneProfile | "all")}
            aria-label="Filter saved advice by style"
            style={{
              borderRadius: "0.7rem",
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              padding: "0.5rem 0.75rem",
              minWidth: "14rem",
            }}
          >
            {toneOptions.map((tone) => (
              <option key={tone} value={tone} style={{ color: "#111827" }}>
                {toneOptionLabels[tone]}
              </option>
            ))}
          </select>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          {filteredCards.length === 0 ? (
            <Box
              gridColumn={{ md: "span 2" }}
              bg="whiteAlpha.120"
              borderRadius="panel"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              p={8}
            >
              <Text color="whiteAlpha.800">No saved advice in this style yet. Save cards from home to build your library.</Text>
            </Box>
          ) : null}

          {filteredCards.map((card) => (
            <Box key={card.id} bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={5}>
              <Flex justify="space-between" align="flex-start" gap={3}>
                <Stack gap={2}>
                  <HStack>
                    <Badge bg="reactor.500" color="white">
                      {getToneProfileLabel(card.toneProfile)}
                    </Badge>
                    <Badge bg="whiteAlpha.200" color="white">
                      {getAdviceFitLabel(card.confidence)}
                    </Badge>
                  </HStack>
                  <Heading as="h2" size="md">
                    {card.headline}
                  </Heading>
                </Stack>
                <Button size="sm" variant="ghost" colorPalette="red" onClick={() => handleDelete(card.id)} aria-label={`Remove saved card ${card.headline}`}>
                  <HStack>
                    <Icon as={FiTrash2} />
                    <Text>Remove</Text>
                  </HStack>
                </Button>
              </Flex>

              <Text mt={3} color="whiteAlpha.900">
                {card.advice}
              </Text>
              <Text mt={3} color="whiteAlpha.700" fontSize="sm">
                Saved {new Date(card.savedAt).toLocaleString()}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
