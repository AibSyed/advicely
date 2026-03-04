import { z } from "zod";

const reflectionEntrySchema = z.object({
  id: z.string(),
  theme: z.string(),
  text: z.string(),
  createdAt: z.string(),
  xpAwarded: z.number().int().positive(),
});

const progressionSchema = z.object({
  version: z.literal(2),
  streakDays: z.number().int().nonnegative(),
  totalXp: z.number().int().nonnegative(),
  sessionsCompleted: z.number().int().nonnegative(),
  lastCheckInDate: z.string().nullable(),
  reflections: z.array(reflectionEntrySchema),
});

export type ProgressionState = z.infer<typeof progressionSchema>;
export type ReflectionEntry = z.infer<typeof reflectionEntrySchema>;

const STORAGE_KEY = "advicely:v3:progression";

export const defaultProgression: ProgressionState = {
  version: 2,
  streakDays: 0,
  totalXp: 0,
  sessionsCompleted: 0,
  lastCheckInDate: null,
  reflections: [],
};

function sameDay(a: Date, b: Date) {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

export function readProgression() {
  if (typeof window === "undefined") {
    return defaultProgression;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProgression;
    }
    return progressionSchema.parse(JSON.parse(raw));
  } catch {
    return defaultProgression;
  }
}

export function writeProgression(state: ProgressionState) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function applyReflection(
  current: ProgressionState,
  reflection: ReflectionEntry,
  now = new Date()
): ProgressionState {
  const today = now.toISOString().slice(0, 10);
  const currentDate = current.lastCheckInDate ? new Date(current.lastCheckInDate) : null;
  const isSameDay = currentDate ? sameDay(currentDate, now) : false;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isBackToBack = currentDate ? sameDay(currentDate, yesterday) : false;

  const nextStreak = isSameDay ? current.streakDays : isBackToBack ? current.streakDays + 1 : 1;

  return {
    ...current,
    totalXp: current.totalXp + reflection.xpAwarded,
    sessionsCompleted: current.sessionsCompleted + (isSameDay ? 0 : 1),
    streakDays: nextStreak,
    lastCheckInDate: today,
    reflections: [reflection, ...current.reflections].slice(0, 40),
  };
}

export function getLevel(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / 120) + 1);
}

export function xpWindow(totalXp: number) {
  const level = getLevel(totalXp);
  const min = (level - 1) * 120;
  const max = level * 120;
  return { min, max, level };
}
