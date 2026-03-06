"use client";

import { usePathname } from "next/navigation";
import { Badge, Box, Container, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";

const routeNotes: Record<string, string> = {
  "/": "Deck open. Draw slowly and save only what still feels useful tomorrow.",
  "/saved": "Library open. Notes stay private until you explicitly include them in a copied card.",
  "/history": "Recent draws open. Live duplicates are filtered before a reserve draw appears.",
  "/sources": "Source notes open. Attribution is part of the product, not a legal footnote.",
};

function resolveRouteNote(pathname: string): string {
  if (pathname.startsWith("/copy/")) {
    return "Copy view open. Source text stays intact, and notes remain hidden unless you opt in.";
  }

  return routeNotes[pathname] ?? routeNotes["/"];
}

export function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <Box as="footer" mt={{ base: 14, md: 20 }} position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        bg="linear-gradient(180deg, rgba(35, 30, 22, 0.96), rgba(16, 31, 22, 0.98))"
      />
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at 12% 0%, rgba(217, 90, 30, 0.18), transparent 28%), radial-gradient(circle at 86% 18%, rgba(79, 154, 113, 0.16), transparent 24%)"
      />
      <Container maxW="7xl" py={{ base: 10, md: 12 }} position="relative">
        <Stack gap={8}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            <Box borderWidth="1px" borderColor="rgba(255, 250, 240, 0.12)" bg="rgba(255, 250, 240, 0.04)" borderRadius="panel" p={5}>
              <Badge bg="paper.200" color="ink.800" px={3} py={1} borderRadius="full">
                Advicely
              </Badge>
              <Text mt={4} fontSize="2xl" fontWeight="700" color="paper.50">
                Random advice and quotes with enough honesty to be worth keeping.
              </Text>
              <Text mt={3} color="paper.100">
                The deck stays close to the original source text, keeps attribution visible, and leaves your private notes in the browser unless you choose otherwise.
              </Text>
            </Box>

            <Box borderWidth="1px" borderColor="rgba(255, 250, 240, 0.12)" bg="rgba(255, 250, 240, 0.04)" borderRadius="panel" p={5}>
              <Badge bg="accent.100" color="accent.800" px={3} py={1} borderRadius="full">
                Deck makeup
              </Badge>
              <HStack mt={4} wrap="wrap" gap={2}>
                <Badge bg="rgba(255, 250, 240, 0.12)" color="paper.50">AdviceSlip</Badge>
                <Badge bg="rgba(255, 250, 240, 0.12)" color="paper.50">ZenQuotes</Badge>
                <Badge bg="rgba(255, 250, 240, 0.12)" color="paper.50">Advicely Reserve</Badge>
              </HStack>
              <Text mt={4} color="paper.100">
                When a live pull fails, repeats, or comes back too weak to keep, the deck falls back to the Advicely Reserve instead of pretending the result is still live.
              </Text>
            </Box>

            <Box borderWidth="1px" borderColor="rgba(255, 250, 240, 0.12)" bg="rgba(255, 250, 240, 0.04)" borderRadius="panel" p={5}>
              <Badge bg="ember.100" color="ember.800" px={3} py={1} borderRadius="full">
                Use judgment
              </Badge>
              <Text mt={4} color="paper.50" fontWeight="700">
                {resolveRouteNote(pathname)}
              </Text>
              <Text mt={3} color="paper.100">
                Advicely is for reflection, not for decisions that could put health, safety, finances, or wellbeing at risk. Use common sense before acting on anything you pull here.
              </Text>
            </Box>
          </SimpleGrid>

          <HStack
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            flexDirection={{ base: "column", md: "row" }}
            gap={3}
            pt={5}
            borderTop="1px solid rgba(255, 250, 240, 0.12)"
          >
            <Text color="paper.100">©{year} Created by Shoaib (Aib) Syed</Text>
            <Text color="paper.100">Random by design. Save selectively. Copy with context.</Text>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
