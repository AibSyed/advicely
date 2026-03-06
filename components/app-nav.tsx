"use client";

import NextLink from "next/link";
import { useLinkStatus } from "next/link";
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
    return pathname === "/saved" || pathname.startsWith("/copy/");
  }

  return pathname === href;
}

function NavCardContent({ item, active }: { item: NavItem; active: boolean }) {
  const { pending } = useLinkStatus();

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="1.25rem"
      borderWidth="1px"
      borderColor={active ? "rgba(61, 126, 90, 0.35)" : pending ? "rgba(217, 90, 30, 0.26)" : "rgba(54, 46, 34, 0.12)"}
      bg={active ? "rgba(79, 154, 113, 0.14)" : pending ? "rgba(255, 244, 236, 0.92)" : "rgba(255, 250, 240, 0.86)"}
      shadow={active || pending ? "float" : "none"}
      px={{ base: 4, md: 4 }}
      py={{ base: 4, md: 4 }}
      minH={{ base: "5.75rem", md: "6.5rem" }}
      transition="transform 140ms ease, box-shadow 220ms ease, border-color 140ms ease, background-color 220ms ease"
      _hover={{ transform: "translateY(-2px)", shadow: "float" }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        h="2px"
        overflow="hidden"
        bg={active ? "rgba(79, 154, 113, 0.24)" : pending ? "rgba(217, 90, 30, 0.18)" : "transparent"}
      >
        {pending ? (
          <Box
            className="nav-card-pulse"
            bg="ember.400"
            h="100%"
            w="45%"
            borderRadius="full"
          />
        ) : active ? (
          <Box bg="accent.400" h="100%" w="100%" />
        ) : null}
      </Box>

      <HStack align="flex-start" gap={3}>
        <Box
          borderRadius="999px"
          bg={active ? "accent.700" : pending ? "ember.400" : "paper.200"}
          color={active || pending ? "paper.50" : "ink.700"}
          p={2}
          flexShrink={0}
          transition="background-color 180ms ease, color 180ms ease"
        >
          <Icon as={item.icon} boxSize={4.5} />
        </Box>
        <Stack gap={0.5} flex="1">
          <Text fontWeight="700" color="ink.800">
            {item.title}
          </Text>
          <Text fontSize="sm" color="ink.600" display={{ base: "none", sm: "block" }}>
            {pending ? `Opening ${item.title.toLowerCase()}...` : item.description}
          </Text>
        </Stack>
      </HStack>
    </Box>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <NextLink key={item.href} href={item.href} style={{ textDecoration: "none" }} aria-current={active ? "page" : undefined}>
            <NavCardContent item={item} active={active} />
          </NextLink>
        );
      })}
    </SimpleGrid>
  );
}
