"use client";

import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Container, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import { RouteLink } from "@/components/route-link";
import { SourceCardView } from "@/components/source-card";
import type { ShareCardVM } from "@/features/library/contracts";
import { getShareCardById } from "@/features/library/storage";

interface ShareExperienceProps {
  shareId: string;
}

function buildCopyText(card: ShareCardVM, includeNote: boolean): string {
  const lines = [card.card.text];

  if (card.card.author) {
    lines.push(`— ${card.card.author}`);
  }

  lines.push("");
  lines.push(`Source: ${card.card.sourceLabel}`);
  if (card.card.provenance === "fallback") {
    lines.push("Provenance: Advicely collection fallback");
  }

  if (includeNote && card.note) {
    lines.push("");
    lines.push(`Personal note: ${card.note}`);
  }

  return lines.join("\n").trim();
}

export function ShareExperience({ shareId }: ShareExperienceProps) {
  const [shareCard, setShareCard] = useState<ShareCardVM | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [includeNote, setIncludeNote] = useState(false);

  useEffect(() => {
    setShareCard(getShareCardById(shareId));
  }, [shareId]);

  async function handleCopy() {
    if (!shareCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopyText(shareCard, includeNote));
      setCopyMessage("Copied to clipboard.");
      setTimeout(() => setCopyMessage(null), 1800);
    } catch {
      setCopyMessage("Clipboard unavailable in this browser.");
      setTimeout(() => setCopyMessage(null), 1800);
    }
  }

  return (
    <Container maxW="5xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <HStack wrap="wrap" gap={3}>
          <RouteLink href="/">Back to draw deck</RouteLink>
          <RouteLink href="/saved">Saved cards</RouteLink>
        </HStack>

        {shareCard ? (
          <Stack gap={5}>
            <Stack gap={3} maxW="3xl">
              <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.96">
                Share card
              </Heading>
              <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
                This card keeps the original text and source attribution. Personal notes stay hidden unless you choose to include them when copying.
              </Text>
            </Stack>

            <SourceCardView
              card={shareCard.card}
              note={includeNote ? shareCard.note : undefined}
              footer={
                <Stack gap={4}>
                  <Text color="ink.500" fontSize="sm">
                    Source: {shareCard.card.sourceLabel} · Created {new Date(shareCard.createdAt).toLocaleString()}
                  </Text>
                  {shareCard.note ? (
                    <Checkbox.Root checked={includeNote} onCheckedChange={(event) => setIncludeNote(event.checked === true)}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>Include personal note when copying</Checkbox.Label>
                    </Checkbox.Root>
                  ) : (
                    <Text color="ink.500" fontSize="sm">No personal note is attached to this card.</Text>
                  )}
                  <Button alignSelf="flex-start" bg="accent.700" color="paper.50" onClick={handleCopy} _hover={{ bg: "accent.600" }}>
                    <HStack>
                      <Icon as={FiCopy} />
                      <Text>Copy share text</Text>
                    </HStack>
                  </Button>
                  {copyMessage ? <Text role="status" color="accent.700">{copyMessage}</Text> : null}
                </Stack>
              }
            />
          </Stack>
        ) : (
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={8} shadow="float">
            <Heading as="h1" size="lg" color="ink.800">We could not find that share card</Heading>
            <Text mt={3} color="ink.600">
              Share links only work in the same browser that created them. Draw a fresh card and make a new share link here.
            </Text>
            <HStack mt={5} gap={3}>
              <RouteLink href="/">Draw a new card</RouteLink>
            </HStack>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
