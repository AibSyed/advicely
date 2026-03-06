"use client";

import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { advicelySystem } from "@/components/theme-system";
import { AppToaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ChakraProvider value={advicelySystem}>
      {children}
      <AppToaster />
    </ChakraProvider>
  );
}
