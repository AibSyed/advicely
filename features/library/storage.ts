"use client";

import type { DrawMode, SourceCardVM } from "@/features/draw/contracts";
import {
  emptyLibraryState,
  type LibraryPreferencesVM,
  type LibraryStateVM,
  type SavedCardVM,
  type CopyCardVM,
} from "@/features/library/contracts";

const STORAGE_KEY = "advicely:v6:library";
const CARD_KINDS = new Set(["advice", "quote"] as const);
const SOURCES = new Set(["advice_slip", "zen_quotes", "advicely_reserve"] as const);
const PROVENANCES = new Set(["live", "fallback"] as const);
const FALLBACK_REASONS = new Set(["provider_unavailable", "invalid_payload", "filtered", "duplicate"] as const);
const DRAW_MODES = new Set(["advice", "quote", "mixed"] as const);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isIsoString(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isSourceCard(value: unknown): value is SourceCardVM {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    CARD_KINDS.has(value.kind as SourceCardVM["kind"]) &&
    typeof value.text === "string" &&
    value.text.length >= 4 &&
    (value.author === undefined || typeof value.author === "string") &&
    SOURCES.has(value.source as SourceCardVM["source"]) &&
    typeof value.sourceLabel === "string" &&
    value.sourceLabel.length > 0 &&
    PROVENANCES.has(value.provenance as SourceCardVM["provenance"]) &&
    (value.fallbackReason === undefined || FALLBACK_REASONS.has(value.fallbackReason as NonNullable<SourceCardVM["fallbackReason"]>)) &&
    typeof value.textHash === "string" &&
    /^[a-f0-9]{64}$/.test(value.textHash) &&
    isIsoString(value.drawnAt)
  );
}

function isSavedCard(value: unknown): value is SavedCardVM {
  if (!isObject(value) || !isSourceCard(value)) {
    return false;
  }

  const candidate = value as SavedCardVM;
  return isIsoString(candidate.savedAt) && (candidate.note === undefined || typeof candidate.note === "string");
}

function isCopyCard(value: unknown): value is CopyCardVM {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    isIsoString(value.createdAt) &&
    isSourceCard(value.card) &&
    (value.note === undefined || typeof value.note === "string")
  );
}

function sanitizeSourceCard(card: SourceCardVM): SourceCardVM {
  return {
    ...card,
    author: typeof card.author === "string" && card.author.trim().length > 0 ? card.author : undefined,
    fallbackReason: card.provenance === "fallback" ? card.fallbackReason : undefined,
  };
}

function sanitizeSavedCard(card: SavedCardVM): SavedCardVM {
  return {
    ...sanitizeSourceCard(card),
    savedAt: card.savedAt,
    note: normalizeNote(card.note),
  };
}

function sanitizeCopyCard(card: CopyCardVM): CopyCardVM {
  return {
    id: card.id,
    createdAt: card.createdAt,
    card: sanitizeSourceCard(card.card),
    note: normalizeNote(card.note),
  };
}

function parseLibraryState(value: unknown): LibraryStateVM {
  if (!isObject(value)) {
    return emptyLibraryState;
  }

  if (value.version !== 6) {
    return emptyLibraryState;
  }

  if (!Array.isArray(value.history) || !Array.isArray(value.savedCards) || !Array.isArray(value.copyCards) || !isObject(value.preferences)) {
    return emptyLibraryState;
  }

  if (!DRAW_MODES.has(value.preferences.lastMode as DrawMode)) {
    return emptyLibraryState;
  }

  const history = value.history.filter(isSourceCard).map(sanitizeSourceCard).slice(0, 160);
  const savedCards = value.savedCards.filter(isSavedCard).map(sanitizeSavedCard).slice(0, 240);
  const copyCards = value.copyCards.filter(isCopyCard).map(sanitizeCopyCard).slice(0, 120);

  return {
    version: 6,
    history,
    savedCards,
    copyCards,
    preferences: {
      lastMode: value.preferences.lastMode as DrawMode,
    },
  };
}

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

    return parseLibraryState(JSON.parse(raw));
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

export function createCopyCard(card: SourceCardVM, note?: string): CopyCardVM {
  const state = readState();
  const copyCard: CopyCardVM = {
    id: getSafeRandomId("copy"),
    createdAt: new Date().toISOString(),
    card,
    note: normalizeNote(note),
  };

  writeState({
    ...state,
    copyCards: [copyCard, ...state.copyCards].slice(0, 120),
  });

  return copyCard;
}

export function getCopyCardById(copyId: string): CopyCardVM | null {
  return readState().copyCards.find((card) => card.id === copyId) ?? null;
}

export function clearLibrary(): LibraryStateVM {
  return writeState(emptyLibraryState);
}
