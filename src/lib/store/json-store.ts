import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type {
  CategoryInput,
  ItemInput,
  Menu,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
} from "@/lib/types";
import type { MenuStore, NewOrder } from "./types";
import { cloneSampleMenu } from "./sample-menu";

/**
 * A filesystem-backed store for local development, so the whole app (including
 * the admin panel) runs with zero external services. On first read it seeds
 * itself from the sample menu. Not used in production — Vercel's filesystem is
 * read-only, so DATABASE_URL selects the Postgres store instead.
 */
const DATA_FILE = path.join(process.cwd(), "data", "menu.local.json");
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.local.json");

async function readOrders(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(ORDERS_FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

async function readMenu(): Promise<Menu> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Menu;
  } catch {
    const seed = cloneSampleMenu();
    await writeMenu(seed);
    return seed;
  }
}

async function writeMenu(menu: Menu): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(menu, null, 2), "utf8");
}

function sortMenu(menu: Menu): Menu {
  const sorted = [...menu].sort((a, b) => a.position - b.position);
  for (const cat of sorted) {
    cat.items.sort((a, b) => a.position - b.position);
  }
  return sorted;
}

export class JsonMenuStore implements MenuStore {
  readonly backend = "json" as const;

  async getMenu(): Promise<Menu> {
    return sortMenu(await readMenu());
  }

  async createCategory(input: CategoryInput): Promise<MenuCategory> {
    const menu = await readMenu();
    const category: MenuCategory = {
      id: randomUUID(),
      name: input.name,
      nameAr: input.nameAr ?? null,
      kicker: input.kicker ?? null,
      position: menu.length,
      items: [],
    };
    menu.push(category);
    await writeMenu(menu);
    return category;
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryInput>,
  ): Promise<MenuCategory> {
    const menu = await readMenu();
    const category = menu.find((c) => c.id === id);
    if (!category) throw new Error("Category not found");
    if (input.name !== undefined) category.name = input.name;
    if (input.nameAr !== undefined) category.nameAr = input.nameAr ?? null;
    if (input.kicker !== undefined) category.kicker = input.kicker ?? null;
    await writeMenu(menu);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const menu = await readMenu();
    const next = menu.filter((c) => c.id !== id);
    next.forEach((c, i) => (c.position = i));
    await writeMenu(next);
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    const menu = await readMenu();
    const index = new Map(orderedIds.map((id, i) => [id, i]));
    for (const cat of menu) {
      if (index.has(cat.id)) cat.position = index.get(cat.id)!;
    }
    await writeMenu(menu);
  }

  async createItem(categoryId: string, input: ItemInput): Promise<MenuItem> {
    const menu = await readMenu();
    const category = menu.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found");
    const item: MenuItem = {
      id: randomUUID(),
      name: input.name,
      nameAr: input.nameAr ?? null,
      description: input.description ?? "",
      descriptionAr: input.descriptionAr ?? null,
      priceBaisa: input.priceBaisa ?? 0,
      imageUrl: input.imageUrl ?? null,
      position: category.items.length,
    };
    category.items.push(item);
    await writeMenu(menu);
    return item;
  }

  async updateItem(id: string, input: Partial<ItemInput>): Promise<MenuItem> {
    const menu = await readMenu();
    for (const category of menu) {
      const item = category.items.find((i) => i.id === id);
      if (item) {
        if (input.name !== undefined) item.name = input.name;
        if (input.nameAr !== undefined) item.nameAr = input.nameAr ?? null;
        if (input.description !== undefined) item.description = input.description;
        if (input.descriptionAr !== undefined) item.descriptionAr = input.descriptionAr ?? null;
        if (input.priceBaisa !== undefined) item.priceBaisa = input.priceBaisa;
        if (input.imageUrl !== undefined) item.imageUrl = input.imageUrl ?? null;
        await writeMenu(menu);
        return item;
      }
    }
    throw new Error("Item not found");
  }

  async deleteItem(id: string): Promise<void> {
    const menu = await readMenu();
    for (const category of menu) {
      const idx = category.items.findIndex((i) => i.id === id);
      if (idx !== -1) {
        category.items.splice(idx, 1);
        category.items.forEach((it, i) => (it.position = i));
        await writeMenu(menu);
        return;
      }
    }
  }

  async reorderItems(categoryId: string, orderedIds: string[]): Promise<void> {
    const menu = await readMenu();
    const category = menu.find((c) => c.id === categoryId);
    if (!category) throw new Error("Category not found");
    const index = new Map(orderedIds.map((id, i) => [id, i]));
    for (const item of category.items) {
      if (index.has(item.id)) item.position = index.get(item.id)!;
    }
    await writeMenu(menu);
  }

  async createOrder(order: NewOrder): Promise<Order> {
    const orders = await readOrders();
    const created: Order = {
      id: randomUUID(),
      table: order.table,
      status: "new",
      note: order.note,
      totalBaisa: order.totalBaisa,
      lines: order.lines,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(created);
    await writeOrders(orders);
    return created;
  }

  async listOrders(): Promise<Order[]> {
    const orders = await readOrders();
    return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const orders = await readOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Order not found");
    order.status = status;
    await writeOrders(orders);
    return order;
  }
}
