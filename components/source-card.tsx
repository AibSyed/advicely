import type { ReactNode } from "react";
import { Badge, Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import type { SourceCardVM } from "@/features/draw/contracts";
import { getCardEyebrow, getCardKindLabel, getFallbackMessage } from "@/features/draw/presentation";

interface SourceCardProps {
  card: SourceCardVM;
  note?: string;
  footer?: ReactNode;
  compact?: boolean;
}

export function SourceCardView({ card, note, footer, compact = false }: SourceCardProps) {
  const fallbackMessage = getFallbackMessage(card.fallbackReason);

  return (
    <Box
      bg="rgba(255, 250, 240, 0.94)"
      borderRadius="panel"
      borderWidth="1px"
      borderColor="rgba(54, 46, 34, 0.12)"
      p={{ base: compact ? 5 : 6, md: compact ? 5 : 7 }}
      shadow="float"
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" inset="0" bg="linear-gradient(180deg, rgba(255,255,255,0.18), transparent 35%)" pointerEvents="none" />
      <Stack gap={compact ? 3 : 4} position="relative">
        <HStack wrap="wrap" gap={2}>
          <Badge bg="paper.200" color="ink.800" px={3} py={1} borderRadius="full">
            {getCardKindLabel(card)}
          </Badge>
          <Badge bg={card.provenance === "live" ? "accent.100" : "ink.100"} color={card.provenance === "live" ? "accent.800" : "ink.700"} px={3} py={1} borderRadius="full">
            {card.provenance === "live" ? "Live source" : "Fallback collection"}
          </Badge>
        </HStack>

        <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.12em" color="ink.500">
          {getCardEyebrow(card)}
        </Text>

        <Heading
          as="h2"
          fontSize={compact ? { base: "2xl", md: "3xl" } : { base: "3xl", md: "5xl" }}
          lineHeight="1.02"
          color="ink.800"
        >
          {card.text}
        </Heading>

        {card.author ? (
          <Text color="ink.600" fontSize={compact ? "md" : "lg"}>
            — {card.author}
          </Text>
        ) : null}

        {fallbackMessage ? (
          <Text color="ember.700" fontSize="sm">
            {fallbackMessage}
          </Text>
        ) : null}

        {note ? (
          <Box borderWidth="1px" borderColor="rgba(54, 46, 34, 0.1)" bg="rgba(255,255,255,0.52)" borderRadius="1rem" p={4}>
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em" color="ink.500" mb={2}>
              Personal note
            </Text>
            <Text color="ink.700">{note}</Text>
          </Box>
        ) : null}

        {footer ? <Box>{footer}</Box> : null}
      </Stack>
    </Box>
  );
}
