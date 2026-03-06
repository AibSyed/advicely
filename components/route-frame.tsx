"use client";

import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

interface RouteFrameProps {
  children: ReactNode;
}

export function RouteFrame({ children }: RouteFrameProps) {
  const pathname = usePathname();

  return (
    <Box key={pathname} className="route-frame-enter" data-route-frame={pathname} minH="100%">
      {children}
    </Box>
  );
}
