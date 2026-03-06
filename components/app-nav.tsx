"use client";

import NextLink from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Box, HStack, Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiBookmark, FiClock, FiCompass, FiInfo } from "react-icons/fi";
import type { IconType } from "react-icons";

interface NavItem {
  href: Route;
  title: string;
  description: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  {
    href: "/",
    title: "Deck",
    description: "Draw a fresh card.",
    icon: FiCompass,
  },
  {
    href: "/saved",
    title: "Library",
    description: "Saved cards worth keeping.",
    icon: FiBookmark,
  },
  {
    href: "/history",
    title: "Recent",
    description: "Latest draws and recalls.",
    icon: FiClock,
  },
  {
    href: "/sources",
    title: "Sources",
    description: "Where the deck comes from.",
    icon: FiInfo,
  },
];

function isActive(pathname: string, href: Route): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/saved") {
    return pathname === "/saved" || pathname.startsWith("/share/");
  }

  return pathname === href;
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <NextLink key={item.href} href={item.href} style={{ textDecoration: "none" }} aria-current={active ? "page" : undefined}>
            <Box
              borderRadius="1.25rem"
              borderWidth="1px"
              borderColor={active ? "rgba(61, 126, 90, 0.35)" : "rgba(54, 46, 34, 0.12)"}
              bg={active ? "rgba(79, 154, 113, 0.14)" : "rgba(255, 250, 240, 0.86)"}
              shadow={active ? "float" : "none"}
              px={{ base: 4, md: 4 }}
              py={{ base: 4, md: 4 }}
              minH={{ base: "5.75rem", md: "6.5rem" }}
              transition="transform 140ms ease, box-shadow 220ms ease, border-color 140ms ease"
              _hover={{ transform: "translateY(-2px)", shadow: "float" }}
            >
              <HStack align="flex-start" gap={3}>
                <Box
                  borderRadius="999px"
                  bg={active ? "accent.700" : "paper.200"}
                  color={active ? "paper.50" : "ink.700"}
                  p={2}
                  flexShrink={0}
                >
                  <Icon as={item.icon} boxSize={4.5} />
                </Box>
                <Stack gap={0.5}>
                  <Text fontWeight="700" color="ink.800">
                    {item.title}
                  </Text>
                  <Text fontSize="sm" color="ink.600" display={{ base: "none", sm: "block" }}>
                    {item.description}
                  </Text>
                </Stack>
              </HStack>
            </Box>
          </NextLink>
        );
      })}
    </SimpleGrid>
  );
}
