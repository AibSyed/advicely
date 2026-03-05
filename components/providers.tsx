"use client";

import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { advicelySystem } from "@/components/theme-system";
import { getQueryClient } from "@/lib/query/client";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={advicelySystem}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
}
