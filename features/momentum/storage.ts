"use client";

import type { AdviceCardVM } from "@/features/advice/contracts";
import { summarizeAdvice } from "@/features/advice/quality";
import {
  emptyMomentumState,
  momentumStateVMSchema,
  type MomentumStateVM,
  type ShareCardVM,
} from "@/features/momentum/contracts";

const STORAGE_KEY = "advicely:v4:momentum";

function todayKey(timestamp: string): string {
  return timestamp.slice(0, 10);
}

function computeStreak(activeDays: string[]): number {
  if (activeDays.length === 0) {
    return 0;
  }

  const daySet = new Set(activeDays);
  let streak = 0;
  const cursor = new Date();

  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!daySet.has(key)) {
      break;
    }

    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return streak;
}

function getSafeRandomId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readState(): MomentumStateVM {
  if (typeof window === "undefined") {
    return emptyMomentumState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return emptyMomentumState;
    }

    const parsed = momentumStateVMSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return emptyMomentumState;
    }

    return parsed.data;
  } catch {
    return emptyMomentumState;
  }
}

function writeState(nextState: MomentumStateVM): MomentumStateVM {
  if (typeof window === "undefined") {
    return nextState;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return nextState;
}

export function getMomentumState(): MomentumStateVM {
  return readState();
}

export function recordGeneration(card: AdviceCardVM): MomentumStateVM {
  const state = readState();
  const day = todayKey(card.generatedAt);
  const activeDaySet = new Set(state.activeDays);
  activeDaySet.add(day);

  const generatedHistory = [
    {
      id: card.id,
      generatedAt: card.generatedAt,
      headline: card.headline,
      adviceSnippet: summarizeAdvice(card.advice),
      toneProfile: card.toneProfile,
      source: card.source,
      confidence: card.confidence,
      textHash: card.textHash,
    },
    ...state.generatedHistory.filter((item) => item.id !== card.id),
  ].slice(0, 60);

  const nextState: MomentumStateVM = {
    ...state,
    activeDays: [...activeDaySet].sort(),
    totalGenerations: state.totalGenerations + 1,
    generatedHistory,
    streakDays: computeStreak([...activeDaySet]),
  };

  return writeState(nextState);
}

export function saveAdviceCard(card: AdviceCardVM): MomentumStateVM {
  const state = readState();

  const alreadySaved = state.savedCards.some((saved) => saved.textHash === card.textHash);
  if (alreadySaved) {
    return state;
  }

  const nextState: MomentumStateVM = {
    ...state,
    savedCards: [
      {
        id: card.id,
        savedAt: new Date().toISOString(),
        headline: card.headline,
        advice: card.advice,
        toneProfile: card.toneProfile,
        source: card.source,
        confidence: card.confidence,
        textHash: card.textHash,
      },
      ...state.savedCards,
    ].slice(0, 120),
  };

  return writeState(nextState);
}

export function removeSavedCard(cardId: string): MomentumStateVM {
  const state = readState();
  const nextState: MomentumStateVM = {
    ...state,
    savedCards: state.savedCards.filter((card) => card.id !== cardId),
  };

  return writeState(nextState);
}

export function addReflection(adviceId: string, reflection: string): MomentumStateVM {
  const state = readState();

  const nextState: MomentumStateVM = {
    ...state,
    reflections: [
      {
        id: getSafeRandomId("reflection"),
        adviceId,
        reflection: reflection.trim(),
        createdAt: new Date().toISOString(),
      },
      ...state.reflections,
    ].slice(0, 200),
  };

  return writeState(nextState);
}

export function createShareCard(card: AdviceCardVM): ShareCardVM {
  const state = readState();

  const shareCard: ShareCardVM = {
    id: getSafeRandomId("share"),
    createdAt: new Date().toISOString(),
    headline: card.headline,
    advice: card.advice,
    toneProfile: card.toneProfile,
    source: card.source,
    confidence: card.confidence,
  };

  const nextState: MomentumStateVM = {
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
