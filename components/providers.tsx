"use client";

import type { ReactNode } from "react";
import { AppToaster } from "@/components/ui/toaster";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <AppToaster />
    </>
  );
}
