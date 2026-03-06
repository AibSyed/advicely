import { z } from "zod";
import { drawModeSchema, sourceCardVMSchema } from "@/features/draw/contracts";

const noteSchema = z
  .string()
  .trim()
  .max(320)
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const savedCardVMSchema = sourceCardVMSchema.extend({
  savedAt: z.string().datetime(),
  note: noteSchema,
});

export const copyCardVMSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  card: sourceCardVMSchema,
  note: noteSchema,
});

export const libraryPreferencesSchema = z.object({
  lastMode: drawModeSchema,
});

export const libraryStateVMSchema = z.object({
  version: z.literal(6),
  history: z.array(sourceCardVMSchema).max(160),
  savedCards: z.array(savedCardVMSchema).max(240),
  copyCards: z.array(copyCardVMSchema).max(120),
  preferences: libraryPreferencesSchema,
});

export const emptyLibraryState: z.infer<typeof libraryStateVMSchema> = {
  version: 6,
  history: [],
  savedCards: [],
  copyCards: [],
  preferences: {
    lastMode: "mixed",
  },
};

export type SavedCardVM = z.infer<typeof savedCardVMSchema>;
export type CopyCardVM = z.infer<typeof copyCardVMSchema>;
export type LibraryPreferencesVM = z.infer<typeof libraryPreferencesSchema>;
export type LibraryStateVM = z.infer<typeof libraryStateVMSchema>;
