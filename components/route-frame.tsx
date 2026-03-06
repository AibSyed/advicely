"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface RouteFrameProps {
  children: ReactNode;
}

export function RouteFrame({ children }: RouteFrameProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="route-frame-enter route-frame" data-route-frame={pathname}>
      {children}
    </div>
  );
}
