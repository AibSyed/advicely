"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiArrowLeft, FiCopy } from "react-icons/fi";
import {
  getAdviceBlockTitle,
  getAdviceFitLabel,
  getIntentLabel,
  getSourceLabel,
  getStyleLabel,
} from "@/features/advice/presentation";
import type { ShareCardVM } from "@/features/workspace/contracts";
import { getShareCardById } from "@/features/workspace/storage";

interface ShareExperienceProps {
  shareId: string;
}

function buildCopyText(card: ShareCardVM): string {
  const lines: string[] = [card.card.headline, "", card.card.summary, ""];

  for (const block of card.card.blocks) {
    lines.push(`${getAdviceBlockTitle(block.type)}:`);
    if ("text" in block) {
      lines.push(block.text);
    } else {
      for (const item of block.items) {
        lines.push(`- ${item}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function ShareExperience({ shareId }: ShareExperienceProps) {
  const [shareCard, setShareCard] = useState<ShareCardVM | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    setShareCard(getShareCardById(shareId));
  }, [shareId]);

  async function handleCopy() {
    if (!shareCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopyText(shareCard));
      setCopyMessage("Copied to clipboard.");
      setTimeout(() => setCopyMessage(null), 1800);
    } catch {
      setCopyMessage("Clipboard unavailable in this browser.");
      setTimeout(() => setCopyMessage(null), 1800);
    }
  }

  return (
    <Container maxW="4xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <NextLink href="/">
          <Button alignSelf="flex-start" variant="ghost" color="gray.800" _hover={{ bg: "gray.100" }}>
            <HStack>
              <Icon as={FiArrowLeft} />
              <Text>Back to studio</Text>
            </HStack>
          </Button>
        </NextLink>

        {shareCard ? (
          <Box
            bg="white"
            borderRadius="1.6rem"
            borderWidth="1px"
            borderColor="gray.200"
            p={{ base: 6, md: 10 }}
            shadow="sm"
          >
            <HStack wrap="wrap" gap={2} mb={4}>
              <Badge bg="utility.600" color="white" px={3} py={1} borderRadius="full">
                {getIntentLabel(shareCard.card.intent)}
              </Badge>
              <Badge bg="gray.100" color="gray.700" px={3} py={1} borderRadius="full">
                {getStyleLabel(shareCard.card.style)}
              </Badge>
              <Badge bg="gray.100" color="gray.700" px={3} py={1} borderRadius="full">
                {getAdviceFitLabel(shareCard.card.confidence)}
              </Badge>
            </HStack>
            <Heading as="h1" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.05" color="gray.900">
              {shareCard.card.headline}
            </Heading>
            <Text mt={5} fontSize={{ base: "lg", md: "2xl" }} color="gray.800" lineHeight="1.45">
              {shareCard.card.summary}
            </Text>

            <Stack mt={6} gap={4}>
              {shareCard.card.blocks.map((block, index) => (
                <Box key={`${block.type}-${index}`} borderWidth="1px" borderColor="gray.200" bg="gray.50" borderRadius="xl" p={4}>
                  <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" mb={2}>
                    {getAdviceBlockTitle(block.type)}
                  </Text>
                  {"text" in block ? (
                    <Text color="gray.800">{block.text}</Text>
                  ) : (
                    <Stack as="ul" gap={2} pl={4} m={0}>
                      {block.items.map((item) => (
                        <Text as="li" key={`${block.type}-${item}`} color="gray.800">
                          {item}
                        </Text>
                      ))}
                    </Stack>
                  )}
                </Box>
              ))}
            </Stack>

            <Text mt={4} color="gray.500" fontSize="sm">
              Source: {getSourceLabel(shareCard.card.source)} · Created {new Date(shareCard.createdAt).toLocaleString()}
            </Text>

            <Button mt={6} onClick={handleCopy} bg="signal.600" color="white" _hover={{ bg: "signal.500" }}>
              <HStack>
                <Icon as={FiCopy} />
                <Text>Copy share text</Text>
              </HStack>
            </Button>
            {copyMessage ? (
              <Text role="status" mt={2} color="green.700" fontSize="sm">
                {copyMessage}
              </Text>
            ) : null}
          </Box>
        ) : (
          <Box bg="white" borderRadius="panel" borderWidth="1px" borderColor="gray.200" p={8} shadow="sm">
            <Heading as="h1" size="lg" color="gray.900">
              We could not find that share card
            </Heading>
            <Text mt={3} color="gray.600">
              This link only works on the same browser that created it. Generate a new card and share again.
            </Text>
            <NextLink href="/">
              <Button mt={5} bg="utility.600" color="white" _hover={{ bg: "utility.500" }}>
                Generate new advice
              </Button>
            </NextLink>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
