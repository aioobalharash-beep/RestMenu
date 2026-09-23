// Shared domain types for the menu. These are the shapes the UI consumes,
// independent of whether data comes from Postgres or the local JSON store.
//
// English fields are the base (required). Arabic fields are optional; the UI
// falls back to English when an Arabic translation is missing.

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  /** Price in baisa. 1 OMR = 1000 baisa. Stored as an integer to avoid float drift. */
  priceBaisa: number;
  imageUrl: string | null;
  position: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string | null;
  kicker: string | null;
  position: number;
  items: MenuItem[];
}

export type Menu = MenuCategory[];

// --- Input shapes for the admin API ---

export interface CategoryInput {
  name: string;
  nameAr?: string | null;
  kicker?: string | null;
}

export interface ItemInput {
  name: string;
  nameAr?: string | null;
  description?: string;
  descriptionAr?: string | null;
  priceBaisa?: number;
  imageUrl?: string | null;
}

// --- Orders ---

export type OrderStatus = "new" | "preparing" | "served" | "cancelled";

export interface OrderLine {
  itemId: string | null;
  name: string;
  nameAr: string | null;
  priceBaisa: number;
  quantity: number;
}

export interface Order {
  id: string;
  table: string | null;
  status: OrderStatus;
  note: string | null;
  totalBaisa: number;
  lines: OrderLine[];
  createdAt: string;
}

/** What a customer submits: item ids + quantities. Totals are computed server-side. */
export interface OrderInput {
  table?: string | null;
  note?: string | null;
  lines: { itemId: string; quantity: number }[];
}
