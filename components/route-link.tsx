import NextLink from "next/link";
import type { Route } from "next";
import type { CSSProperties, ReactNode } from "react";

interface RouteLinkProps {
  href: Route | string;
  children: ReactNode;
  active?: boolean;
}

export function RouteLink({ href, children, active = false }: RouteLinkProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    borderRadius: "999px",
    border: active ? "1px solid rgba(45, 100, 70, 0.38)" : "1px solid rgba(54, 46, 34, 0.14)",
    padding: "0.7rem 1rem",
    background: active ? "rgba(79, 154, 113, 0.16)" : "rgba(255, 250, 240, 0.82)",
    color: "#241e16",
    textDecoration: "none",
    fontWeight: 700,
    boxShadow: active ? "0 12px 30px rgba(45, 100, 70, 0.12)" : "none",
  };

  return (
    <NextLink href={href as Route} style={style}>
      {children}
    </NextLink>
  );
}
