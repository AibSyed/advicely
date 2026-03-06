"use client";

import {
  Box,
  HStack,
  Icon,
  Portal,
  Stack,
  Text,
  ToastCloseTrigger,
  ToastDescription,
  ToastIndicator,
  ToastRoot,
  ToastTitle,
  Toaster,
  createToaster,
} from "@chakra-ui/react";
import { FiArrowUpRight } from "react-icons/fi";

export const toaster = createToaster({
  placement: "top-end",
  max: 3,
  pauseOnPageIdle: true,
  offsets: { top: "1.25rem", right: "1.25rem", left: "1rem", bottom: "1rem" },
});

export function AppToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster} insetInline={{ base: "1rem", md: "1.5rem" }}>
        {(toast) => (
          <ToastRoot
            width={{ base: "calc(100vw - 2rem)", sm: "24rem" }}
            borderRadius="1.25rem"
            borderWidth="1px"
            borderColor="rgba(54, 46, 34, 0.12)"
            bg="rgba(255, 250, 240, 0.96)"
            color="ink.800"
            shadow="float"
            backdropFilter="blur(18px)"
          >
            <HStack align="flex-start" gap={3} p={4}>
              <Box
                borderRadius="999px"
                bg={toast.type === "error" ? "ember.100" : toast.type === "success" ? "accent.100" : "paper.200"}
                color={toast.type === "error" ? "ember.700" : toast.type === "success" ? "accent.700" : "ink.700"}
                p={2}
                flexShrink={0}
              >
                {toast.type === "info" ? <Icon as={FiArrowUpRight} boxSize={4} /> : <ToastIndicator />}
              </Box>

              <Stack gap={1} flex="1">
                {toast.title ? (
                  <ToastTitle>
                    <Text fontWeight="700" color="ink.800">
                      {toast.title}
                    </Text>
                  </ToastTitle>
                ) : null}
                {toast.description ? (
                  <ToastDescription>
                    <Text color="ink.600" fontSize="sm">
                      {toast.description}
                    </Text>
                  </ToastDescription>
                ) : null}
              </Stack>

              <ToastCloseTrigger color="ink.500" mt={0.5} />
            </HStack>
          </ToastRoot>
        )}
      </Toaster>
    </Portal>
  );
}
