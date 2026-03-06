import { Badge, Box, Container, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { AppNav } from "@/components/app-nav";

export function SourceGuide() {
  return (
    <Container maxW="6xl" py={{ base: 8, md: 12 }}>
      <Stack gap={8}>
        <Stack gap={3} maxW="3xl">
          <Badge alignSelf="flex-start" bg="ink.800" color="paper.50" px={3} py={1} borderRadius="full">
            Source notes
          </Badge>
          <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} color="ink.800" lineHeight="0.96">
            Where the deck comes from.
          </Heading>
          <Text color="ink.600" fontSize={{ base: "md", md: "lg" }}>
            Advicely is a transparent draw deck for random advice and quotes. It does not tailor live source content to your situation, and it does not present itself as professional guidance.
          </Text>
        </Stack>

        <AppNav />

        <Stack gap={5}>
          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={6} shadow="float">
            <HStack wrap="wrap" gap={2} mb={3}>
              <Badge bg="paper.200" color="ink.800">Live advice</Badge>
              <Badge bg="accent.100" color="accent.800">AdviceSlip</Badge>
            </HStack>
            <Heading as="h2" size="lg" color="ink.800">AdviceSlip</Heading>
            <Text mt={3} color="ink.600">
              Advice mode pulls one random advice slip from AdviceSlip and presents it as a source card, not a personalized recommendation.
            </Text>
            <Text mt={3} color="ink.600">
              Official site: <a href="https://api.adviceslip.com/" target="_blank" rel="noreferrer">api.adviceslip.com</a>
            </Text>
          </Box>

          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={6} shadow="float">
            <HStack wrap="wrap" gap={2} mb={3}>
              <Badge bg="paper.200" color="ink.800">Live quote</Badge>
              <Badge bg="ember.100" color="ember.800">ZenQuotes</Badge>
            </HStack>
            <Heading as="h2" size="lg" color="ink.800">ZenQuotes</Heading>
            <Text mt={3} color="ink.600">
              Quote mode pulls one random quote from ZenQuotes and preserves the author when it is provided.
            </Text>
            <Text mt={3} color="ink.600">
              Official docs: <a href="https://docs.zenquotes.io/zenquotes-documentation/" target="_blank" rel="noreferrer">docs.zenquotes.io</a>
            </Text>
          </Box>

          <Box bg="rgba(255, 250, 240, 0.92)" borderRadius="panel" borderWidth="1px" borderColor="rgba(54, 46, 34, 0.12)" p={6} shadow="float">
            <HStack wrap="wrap" gap={2} mb={3}>
              <Badge bg="paper.200" color="ink.800">Reserve</Badge>
              <Badge bg="ink.100" color="ink.700">Advicely Reserve</Badge>
            </HStack>
            <Heading as="h2" size="lg" color="ink.800">Advicely Reserve</Heading>
            <Text mt={3} color="ink.600">
              When a live pull fails, repeats, or returns unusable data, Advicely uses its own reserve deck instead of pretending the result is still live.
            </Text>
            <Text mt={3} color="ink.600">
              Private notes stay in browser storage under `advicely:v6:library` and are never sent to AdviceSlip or ZenQuotes.
            </Text>
          </Box>
        </Stack>

        <Box bg="ink.800" color="paper.50" borderRadius="panel" p={6} shadow="float">
          <Heading as="h2" size="lg">Use judgment</Heading>
          <Text mt={3} color="paper.100">
            Advicely is for reflection, curation, and lightweight sharing. It is not medical, legal, financial, crisis, or otherwise professional advice.
          </Text>
        </Box>
      </Stack>
    </Container>
  );
}
