// Shared domain types for the menu. These are the shapes the UI consumes,
// independent of whether data comes from Postgres or the local JSON store.

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in baisa. 1 OMR = 1000 baisa. Stored as an integer to avoid float drift. */
  priceBaisa: number;
  imageUrl: string | null;
  position: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  kicker: string | null;
  position: number;
  items: MenuItem[];
}

export type Menu = MenuCategory[];

// --- Input shapes for the admin API ---

export interface CategoryInput {
  name: string;
  kicker?: string | null;
}

export interface ItemInput {
  name: string;
  description?: string;
  priceBaisa?: number;
  imageUrl?: string | null;
}
