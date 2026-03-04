"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChakraProvider,
  createSystem,
  defaultConfig,
} from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "var(--font-display), sans-serif" },
        body: { value: "var(--font-body), sans-serif" },
      },
    },
  },
});

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ChakraProvider value={system}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  );
}
