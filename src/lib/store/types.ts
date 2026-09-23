import type {
  CategoryInput,
  ItemInput,
  Menu,
  MenuCategory,
  MenuItem,
  Order,
  OrderLine,
  OrderStatus,
} from "@/lib/types";

export interface NewOrder {
  table: string | null;
  note: string | null;
  lines: OrderLine[];
  totalBaisa: number;
}

/**
 * The storage contract the app depends on. Two implementations satisfy it:
 * a Prisma/Postgres store (production) and a JSON-file store (local dev).
 * The rest of the app never imports a concrete store directly.
 */
export interface MenuStore {
  /** Full menu, categories ordered by position, items ordered by position. */
  getMenu(): Promise<Menu>;

  createCategory(input: CategoryInput): Promise<MenuCategory>;
  updateCategory(id: string, input: Partial<CategoryInput>): Promise<MenuCategory>;
  deleteCategory(id: string): Promise<void>;
  reorderCategories(orderedIds: string[]): Promise<void>;

  createItem(categoryId: string, input: ItemInput): Promise<MenuItem>;
  updateItem(id: string, input: Partial<ItemInput>): Promise<MenuItem>;
  deleteItem(id: string): Promise<void>;
  reorderItems(categoryId: string, orderedIds: string[]): Promise<void>;

  // Orders
  createOrder(order: NewOrder): Promise<Order>;
  listOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;

  /** Human-readable label for the active backend (shown in admin). */
  readonly backend: "postgres" | "json";
}
