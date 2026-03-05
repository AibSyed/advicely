import { z } from "zod";
import {
  adviceCardVMSchema,
  adviceDetailSchema,
  adviceIntentSchema,
  adviceStyleSchema,
} from "@/features/advice/contracts";

export const savedAdviceCardSchema = adviceCardVMSchema.extend({
  savedAt: z.string().datetime(),
});

export const shareCardVMSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime(),
  card: adviceCardVMSchema,
});

export const workspacePreferencesSchema = z.object({
  lastIntent: adviceIntentSchema,
  lastStyle: adviceStyleSchema,
  lastDetail: adviceDetailSchema,
  contextDraft: z.string().max(600).optional(),
});

export const workspaceStateVMSchema = z.object({
  version: z.literal(5),
  history: z.array(adviceCardVMSchema).max(160),
  savedCards: z.array(savedAdviceCardSchema).max(240),
  shareCards: z.array(shareCardVMSchema).max(120),
  preferences: workspacePreferencesSchema,
});

export const emptyWorkspaceState: z.infer<typeof workspaceStateVMSchema> = {
  version: 5,
  history: [],
  savedCards: [],
  shareCards: [],
  preferences: {
    lastIntent: "general",
    lastStyle: "balanced",
    lastDetail: "standard",
    contextDraft: "",
  },
};

export type WorkspaceStateVM = z.infer<typeof workspaceStateVMSchema>;
export type SavedAdviceCardVM = z.infer<typeof savedAdviceCardSchema>;
export type ShareCardVM = z.infer<typeof shareCardVMSchema>;
export type WorkspacePreferencesVM = z.infer<typeof workspacePreferencesSchema>;
