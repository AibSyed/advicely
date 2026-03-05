"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
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
import { FiArrowLeft, FiCheckCircle, FiEdit3, FiZap } from "react-icons/fi";
import { addReflection, getMomentumState } from "@/features/momentum/storage";
import { emptyMomentumState, type MomentumStateVM } from "@/features/momentum/contracts";

const reflectionFormSchema = z.object({
  adviceId: z.string().min(1, "Choose an advice card first."),
  reflection: z.string().trim().min(12, "Write at least 12 characters so this note is useful.").max(280),
});

type ReflectionFormValues = z.infer<typeof reflectionFormSchema>;

export function MomentumDashboard() {
  const [state, setState] = useState<MomentumStateVM>(emptyMomentumState);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    setState(getMomentumState());
  }, []);

  const form = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionFormSchema),
    defaultValues: {
      adviceId: "",
      reflection: "",
    },
  });

  const historyOptions = useMemo(() => state.generatedHistory.slice(0, 12), [state.generatedHistory]);

  const reflectionCount = state.reflections.length;

  const onSubmit = form.handleSubmit((values) => {
    const nextState = addReflection(values.adviceId, values.reflection);
    setState(nextState);
    form.reset({
      adviceId: values.adviceId,
      reflection: "",
    });
    setSavedMessage("Reflection saved.");
    setTimeout(() => setSavedMessage(null), 2000);
  });

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
            Your progress
          </Heading>
          <Text color="whiteAlpha.800" maxW="2xl">
            Keep a simple record of what you have tried and what helped.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 4 }} gap={4}>
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
            <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.08em">
              Days practiced
            </Text>
            <Text fontSize="3xl" fontWeight="700">
              {state.streakDays} days
            </Text>
          </Box>
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
            <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.08em">
              Advice sessions
            </Text>
            <Text fontSize="3xl" fontWeight="700">
              {state.totalGenerations}
            </Text>
          </Box>
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
            <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.08em">
              Saved advice
            </Text>
            <Text fontSize="3xl" fontWeight="700">
              {state.savedCards.length}
            </Text>
          </Box>
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
            <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.08em">
              Notes written
            </Text>
            <Text fontSize="3xl" fontWeight="700">
              {reflectionCount}
            </Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Box bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={5}>
            <HStack mb={4} color="reactor.100">
              <Icon as={FiZap} />
              <Heading as="h2" size="md">
                Recent advice
              </Heading>
            </HStack>
            <Stack gap={3} maxH="23rem" overflowY="auto" pr={1}>
              {state.generatedHistory.length === 0 ? (
                <Text color="whiteAlpha.700">Generate your first advice card from the home page.</Text>
              ) : null}
              {state.generatedHistory.map((item) => (
                <Box key={item.id} borderWidth="1px" borderColor="whiteAlpha.300" borderRadius="xl" p={3} bg="whiteAlpha.100">
                  <Text fontSize="sm" color="whiteAlpha.700">
                    {new Date(item.generatedAt).toLocaleString()} · {item.toneProfile}
                  </Text>
                  <Text mt={1} fontWeight="600" color="white">
                    {item.headline}
                  </Text>
                  <Text mt={1} color="whiteAlpha.900">
                    {item.adviceSnippet}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box as="form" onSubmit={onSubmit} bg="whiteAlpha.120" borderRadius="panel" borderWidth="1px" borderColor="whiteAlpha.300" p={5}>
            <HStack mb={4} color="ember.100">
              <Icon as={FiEdit3} />
              <Heading as="h2" size="md">
                Add a quick note
              </Heading>
            </HStack>

            <Stack gap={4}>
              <Box>
                <Text mb={2} color="whiteAlpha.800">
                  Advice card
                </Text>
                <select
                  aria-label="Advice card"
                  style={{
                    width: "100%",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.28)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "0.75rem",
                  }}
                  {...form.register("adviceId")}
                >
                  <option value="" style={{ color: "#1f2937" }}>
                    Choose a recent card
                  </option>
                  {historyOptions.map((item) => (
                    <option key={item.id} value={item.id} style={{ color: "#1f2937" }}>
                      {item.headline} ({new Date(item.generatedAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {form.formState.errors.adviceId ? (
                  <Text mt={1} color="red.300" fontSize="sm">
                    {form.formState.errors.adviceId.message}
                  </Text>
                ) : null}
              </Box>

              <Box>
                <Text mb={2} color="whiteAlpha.800">
                  What happened after trying it?
                </Text>
                <textarea
                  rows={5}
                  aria-label="Outcome note"
                  style={{
                    width: "100%",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.28)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "0.75rem",
                  }}
                  placeholder="Write what you tried and what happened..."
                  {...form.register("reflection")}
                />
                {form.formState.errors.reflection ? (
                  <Text mt={1} color="red.300" fontSize="sm">
                    {form.formState.errors.reflection.message}
                  </Text>
                ) : null}
              </Box>

              <Flex justify="space-between" align="center" gap={3}>
                <Button type="submit" bg="reactor.500" color="white" _hover={{ bg: "reactor.400" }}>
                  <HStack>
                    <Icon as={FiCheckCircle} />
                    <Text>Save note</Text>
                  </HStack>
                </Button>
                {savedMessage ? (
                  <Text role="status" color="green.300" fontSize="sm">
                    {savedMessage}
                  </Text>
                ) : null}
              </Flex>
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
