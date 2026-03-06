"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { Badge, Box, Button, Checkbox, Container, Heading, HStack, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import { AppNav } from "@/components/app-nav";
import { SourceCardView } from "@/components/source-card";
import { notifyError, notifySuccess } from "@/features/feedback/notify";
import { buildCopyCardText } from "@/features/library/copy-text";
import type { CopyCardVM } from "@/features/library/contracts";
import { getCopyCardById } from "@/features/library/storage";

interface CopyExperienceProps {
  copyId: string;
}

export function CopyExperience({ copyId }: CopyExperienceProps) {
  const [copyCard, setCopyCard] = useState<CopyCardVM | null | undefined>(undefined);
  const [includeNote, setIncludeNote] = useState(false);

  useEffect(() => {
    setCopyCard(getCopyCardById(copyId));
  }, [copyId]);

  async function handleCopy() {
    if (!copyCard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(buildCopyCardText(copyCard, includeNote));
      notifySuccess({
        title: "Copied to clipboard",
        description: includeNote ? "Your private note was included in this copy." : "Your private note stayed out of this copy.",
      });
    } catch {
      notifyError({
        title: "Clipboard unavailable",
        description: "Try copying from a browser tab with clipboard access enabled.",
      });
    }
  }

  return (
    <Container maxW="5xl" py={{ base: 6, md: 10 }}>
      <Stack gap={8}>
        <Stack gap={3} maxW="3xl">
          <Badge alignSelf="flex-start" bg="ink.800" color="paper.50" px={3} py={1} borderRadius="full">
            Copy
          </Badge>
          <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.96">
            Copy card
          </Heading>
          <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
            Source text stays intact, attribution stays visible, and your private note stays hidden unless you explicitly include it.
          </Text>
        </Stack>

        <AppNav />

        {copyCard === undefined ? (
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={8} shadow="float">
            <HStack gap={3} color="ink.600">
              <Spinner size="sm" color="accent.700" />
              <Text>Checking this local copy...</Text>
            </HStack>
          </Box>
        ) : copyCard ? (
          <SourceCardView
            card={copyCard.card}
            note={includeNote ? copyCard.note : undefined}
            footer={
              <Stack gap={4}>
                <Text color="ink.500" fontSize="sm">
                  Source: {copyCard.card.sourceLabel} · Created {new Date(copyCard.createdAt).toLocaleString()}
                </Text>
                {copyCard.note ? (
                  <Checkbox.Root checked={includeNote} onCheckedChange={(event) => setIncludeNote(event.checked === true)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Include private note when copying</Checkbox.Label>
                  </Checkbox.Root>
                ) : (
                  <Text color="ink.500" fontSize="sm">
                    No private note is attached to this card.
                  </Text>
                )}
                <Button alignSelf="flex-start" bg="accent.700" color="paper.50" onClick={handleCopy} _hover={{ bg: "accent.600" }}>
                  <HStack>
                    <Icon as={FiCopy} />
                    <Text>Copy card text</Text>
                  </HStack>
                </Button>
              </Stack>
            }
          />
        ) : (
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={8} shadow="float">
            <Heading as="h1" size="lg" color="ink.800">
              We could not find that local copy
            </Heading>
            <Text mt={3} color="ink.600">
              This copy view only works in the same browser that created it. Draw a fresh card and make a new local copy here.
            </Text>
            <Text mt={4}>
              <NextLink href="/" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "0.18em" }}>
                Draw a new card
              </NextLink>
            </Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
