"use client";

import type { ReactNode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { advicelySystem } from "@/components/theme-system";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <ChakraProvider value={advicelySystem}>{children}</ChakraProvider>;
}
