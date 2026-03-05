"use client";

import type {
  AdviceCardVM,
  AdviceDetail,
  AdviceIntent,
  AdviceStyle,
} from "@/features/advice/contracts";
import {
  emptyWorkspaceState,
  type ShareCardVM,
  type WorkspacePreferencesVM,
  type WorkspaceStateVM,
  workspaceStateVMSchema,
} from "@/features/workspace/contracts";

const STORAGE_KEY = "advicely:v5:workspace";

function getSafeRandomId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readState(): WorkspaceStateVM {
  if (typeof window === "undefined") {
    return emptyWorkspaceState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyWorkspaceState;
    }

    const parsed = workspaceStateVMSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return emptyWorkspaceState;
    }

    return parsed.data;
  } catch {
    return emptyWorkspaceState;
  }
}

function writeState(nextState: WorkspaceStateVM): WorkspaceStateVM {
  if (typeof window === "undefined") {
    return nextState;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function getWorkspaceState(): WorkspaceStateVM {
  return readState();
}

export function getRecentHashes(limit = 20): string[] {
  const state = readState();
  const unique = new Set<string>();

  for (const item of state.history) {
    unique.add(item.textHash);
    if (unique.size >= limit) {
      break;
    }
  }

  return [...unique];
}

export function recordGeneratedAdvice(card: AdviceCardVM): WorkspaceStateVM {
  const state = readState();

  const nextState: WorkspaceStateVM = {
    ...state,
    history: [card, ...state.history.filter((entry) => entry.id !== card.id)].slice(0, 160),
    preferences: {
      ...state.preferences,
      lastIntent: card.intent,
      lastStyle: card.style,
      lastDetail: card.detail,
      contextDraft: card.context ?? state.preferences.contextDraft ?? "",
    },
  };

  return writeState(nextState);
}

export function saveAdviceCard(card: AdviceCardVM): WorkspaceStateVM {
  const state = readState();

  const alreadySaved = state.savedCards.some((saved) => saved.textHash === card.textHash);
  if (alreadySaved) {
    return state;
  }

  const nextState: WorkspaceStateVM = {
    ...state,
    savedCards: [
      {
        ...card,
        savedAt: new Date().toISOString(),
      },
      ...state.savedCards,
    ].slice(0, 240),
  };

  return writeState(nextState);
}

export function removeSavedCard(cardId: string): WorkspaceStateVM {
  const state = readState();
  const nextState: WorkspaceStateVM = {
    ...state,
    savedCards: state.savedCards.filter((card) => card.id !== cardId),
  };

  return writeState(nextState);
}

export function isCardSaved(card: AdviceCardVM): boolean {
  const state = readState();
  return state.savedCards.some((saved) => saved.textHash === card.textHash);
}

export function createShareCard(card: AdviceCardVM): ShareCardVM {
  const state = readState();

  const shareCard: ShareCardVM = {
    id: getSafeRandomId("share"),
    createdAt: new Date().toISOString(),
    card,
  };

  const nextState: WorkspaceStateVM = {
    ...state,
    shareCards: [shareCard, ...state.shareCards].slice(0, 120),
  };

  writeState(nextState);
  return shareCard;
}

export function getShareCardById(shareId: string): ShareCardVM | null {
  const state = readState();
  return state.shareCards.find((card) => card.id === shareId) ?? null;
}

interface PreferencePatch {
  intent?: AdviceIntent;
  style?: AdviceStyle;
  detail?: AdviceDetail;
  contextDraft?: string;
}

export function updateWorkspacePreferences(patch: PreferencePatch): WorkspacePreferencesVM {
  const state = readState();
  const nextPreferences: WorkspacePreferencesVM = {
    ...state.preferences,
    ...(patch.intent ? { lastIntent: patch.intent } : {}),
    ...(patch.style ? { lastStyle: patch.style } : {}),
    ...(patch.detail ? { lastDetail: patch.detail } : {}),
    ...(patch.contextDraft !== undefined
      ? { contextDraft: patch.contextDraft.slice(0, 600) }
      : {}),
  };

  writeState({
    ...state,
    preferences: nextPreferences,
  });

  return nextPreferences;
}

export function clearWorkspace(): WorkspaceStateVM {
  return writeState(emptyWorkspaceState);
}
