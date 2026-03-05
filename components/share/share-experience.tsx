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
import { getShareCardById } from "@/features/momentum/storage";
import type { ShareCardVM } from "@/features/momentum/contracts";

interface ShareExperienceProps {
  shareId: string;
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
      await navigator.clipboard.writeText(`${shareCard.headline}\n\n${shareCard.advice}`);
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
          <Button alignSelf="flex-start" variant="ghost">
            <HStack>
              <Icon as={FiArrowLeft} />
              <Text>Back to reactor</Text>
            </HStack>
          </Button>
        </NextLink>

        {shareCard ? (
          <Box
            bg="linear-gradient(130deg, rgba(22,39,89,0.92), rgba(70,29,18,0.85))"
            borderRadius="1.6rem"
            borderWidth="1px"
            borderColor="whiteAlpha.300"
            p={{ base: 6, md: 10 }}
          >
            <HStack gap={2} mb={4}>
              <Badge bg="reactor.500" color="white" px={3} py={1} borderRadius="full">
                {shareCard.toneProfile}
              </Badge>
              <Badge bg="whiteAlpha.200" color="white" px={3} py={1} borderRadius="full">
                {Math.round(shareCard.confidence * 100)}% confidence
              </Badge>
            </HStack>
            <Heading as="h1" id="main-content" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.05">
              {shareCard.headline}
            </Heading>
            <Text mt={5} fontSize={{ base: "lg", md: "2xl" }} color="whiteAlpha.950" lineHeight="1.45">
              {shareCard.advice}
            </Text>
            <Text mt={4} color="whiteAlpha.700" fontSize="sm">
              Generated from {shareCard.source} · {new Date(shareCard.createdAt).toLocaleString()}
            </Text>

            <Button mt={6} onClick={handleCopy} bg="ember.500" color="white" _hover={{ bg: "ember.400" }}>
              <HStack>
                <Icon as={FiCopy} />
                <Text>Copy share text</Text>
              </HStack>
            </Button>
            {copyMessage ? (
              <Text role="status" mt={2} color="green.300" fontSize="sm">
                {copyMessage}
              </Text>
            ) : null}
          </Box>
        ) : (
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={8}>
            <Heading as="h1" id="main-content" size="lg">
              Share card not found
            </Heading>
            <Text mt={3} color="whiteAlpha.800">
              This share card may have expired from local storage. Generate a new card and create a fresh share link.
            </Text>
            <NextLink href="/">
              <Button mt={5} bg="reactor.500">
                Generate new advice
              </Button>
            </NextLink>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
