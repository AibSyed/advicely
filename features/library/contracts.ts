import type { DrawMode, SourceCardVM } from "@/features/draw/contracts";

export interface SavedCardVM extends SourceCardVM {
  savedAt: string;
  note?: string;
}

export interface CopyCardVM {
  id: string;
  createdAt: string;
  card: SourceCardVM;
  note?: string;
}

export interface LibraryPreferencesVM {
  lastMode: DrawMode;
}

export interface LibraryStateVM {
  version: 6;
  history: SourceCardVM[];
  savedCards: SavedCardVM[];
  copyCards: CopyCardVM[];
  preferences: LibraryPreferencesVM;
}

export const emptyLibraryState: LibraryStateVM = {
  version: 6,
  history: [],
  savedCards: [],
  copyCards: [],
  preferences: {
    lastMode: "mixed",
  },
};
