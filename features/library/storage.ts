"use client";

import type { DrawMode, SourceCardVM } from "@/features/draw/contracts";
import {
  emptyLibraryState,
  type LibraryPreferencesVM,
  type LibraryStateVM,
  type SavedCardVM,
  type ShareCardVM,
  libraryStateVMSchema,
} from "@/features/library/contracts";

const STORAGE_KEY = "advicely:v6:library";

function normalizeNote(note?: string): string | undefined {
  const normalized = note?.trim().slice(0, 320);
  return normalized ? normalized : undefined;
}

function getSafeRandomId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readState(): LibraryStateVM {
  if (typeof window === "undefined") {
    return emptyLibraryState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyLibraryState;
    }

    const parsed = libraryStateVMSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyLibraryState;
  } catch {
    return emptyLibraryState;
  }
}

function writeState(nextState: LibraryStateVM): LibraryStateVM {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  return nextState;
}

export function getLibraryState(): LibraryStateVM {
  return readState();
}

export function getRecentHashes(limit = 24): string[] {
  const state = readState();
  const unique = new Set<string>();

  for (const card of state.history) {
    unique.add(card.textHash);
    if (unique.size >= limit) {
      break;
    }
  }

  return [...unique];
}

export function updatePreferences(mode: DrawMode): LibraryPreferencesVM {
  const state = readState();
  const nextPreferences: LibraryPreferencesVM = {
    ...state.preferences,
    lastMode: mode,
  };

  writeState({
    ...state,
    preferences: nextPreferences,
  });

  return nextPreferences;
}

export function recordDrawnCard(card: SourceCardVM): LibraryStateVM {
  const state = readState();

  return writeState({
    ...state,
    history: [card, ...state.history.filter((entry) => entry.id !== card.id)].slice(0, 160),
  });
}

export function findSavedCardByHash(textHash: string): SavedCardVM | undefined {
  return readState().savedCards.find((card) => card.textHash === textHash);
}

export function isCardSaved(card: SourceCardVM): boolean {
  return Boolean(findSavedCardByHash(card.textHash));
}

export function saveCard(card: SourceCardVM, note?: string): LibraryStateVM {
  const state = readState();
  const normalizedNote = normalizeNote(note);
  const existing = state.savedCards.find((saved) => saved.textHash === card.textHash);

  if (existing) {
    const nextSavedCards = state.savedCards.map((saved) =>
      saved.textHash === card.textHash
        ? {
            ...saved,
            note: normalizedNote,
          }
        : saved,
    );

    return writeState({
      ...state,
      savedCards: nextSavedCards,
    });
  }

  return writeState({
    ...state,
    savedCards: [
      {
        ...card,
        savedAt: new Date().toISOString(),
        note: normalizedNote,
      },
      ...state.savedCards,
    ].slice(0, 240),
  });
}

export function updateSavedCardNote(cardId: string, note?: string): LibraryStateVM {
  const state = readState();
  const normalizedNote = normalizeNote(note);

  return writeState({
    ...state,
    savedCards: state.savedCards.map((card) =>
      card.id === cardId
        ? {
            ...card,
            note: normalizedNote,
          }
        : card,
    ),
  });
}

export function removeSavedCard(cardId: string): LibraryStateVM {
  const state = readState();

  return writeState({
    ...state,
    savedCards: state.savedCards.filter((card) => card.id !== cardId),
  });
}

export function createShareCard(card: SourceCardVM, note?: string): ShareCardVM {
  const state = readState();
  const shareCard: ShareCardVM = {
    id: getSafeRandomId("share"),
    createdAt: new Date().toISOString(),
    card,
    note: normalizeNote(note),
  };

  writeState({
    ...state,
    shareCards: [shareCard, ...state.shareCards].slice(0, 120),
  });

  return shareCard;
}

export function getShareCardById(shareId: string): ShareCardVM | null {
  return readState().shareCards.find((card) => card.id === shareId) ?? null;
}

export function clearLibrary(): LibraryStateVM {
  return writeState(emptyLibraryState);
}
