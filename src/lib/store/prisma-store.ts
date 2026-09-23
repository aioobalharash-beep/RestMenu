import type {
  CategoryInput,
  ItemInput,
  Menu,
  MenuCategory,
  MenuItem,
} from "@/lib/types";
import { prisma } from "@/lib/prisma";
import type { MenuStore } from "./types";

type PrismaItem = {
  id: string;
  name: string;
  nameAr: string | null;
  description: string;
  descriptionAr: string | null;
  priceBaisa: number;
  imageUrl: string | null;
  position: number;
};

function toItem(i: PrismaItem): MenuItem {
  return {
    id: i.id,
    name: i.name,
    nameAr: i.nameAr,
    description: i.description,
    descriptionAr: i.descriptionAr,
    priceBaisa: i.priceBaisa,
    imageUrl: i.imageUrl,
    position: i.position,
  };
}

/** Postgres-backed store used in production (selected when DATABASE_URL is set). */
export class PrismaMenuStore implements MenuStore {
  readonly backend = "postgres" as const;

  async getMenu(): Promise<Menu> {
    const categories = await prisma.category.findMany({
      orderBy: { position: "asc" },
      include: { items: { orderBy: { position: "asc" } } },
    });
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      kicker: c.kicker,
      position: c.position,
      items: c.items.map(toItem),
    }));
  }

  async createCategory(input: CategoryInput): Promise<MenuCategory> {
    const count = await prisma.category.count();
    const c = await prisma.category.create({
      data: {
        name: input.name,
        nameAr: input.nameAr ?? null,
        kicker: input.kicker ?? null,
        position: count,
      },
      include: { items: true },
    });
    return { id: c.id, name: c.name, nameAr: c.nameAr, kicker: c.kicker, position: c.position, items: [] };
  }

  async updateCategory(
    id: string,
    input: Partial<CategoryInput>,
  ): Promise<MenuCategory> {
    const c = await prisma.category.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.nameAr !== undefined ? { nameAr: input.nameAr ?? null } : {}),
        ...(input.kicker !== undefined ? { kicker: input.kicker ?? null } : {}),
      },
      include: { items: { orderBy: { position: "asc" } } },
    });
    return {
      id: c.id,
      name: c.name,
      nameAr: c.nameAr,
      kicker: c.kicker,
      position: c.position,
      items: c.items.map(toItem),
    };
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    await prisma.$transaction(
      orderedIds.map((id, position) =>
        prisma.category.update({ where: { id }, data: { position } }),
      ),
    );
  }

  async createItem(categoryId: string, input: ItemInput): Promise<MenuItem> {
    const count = await prisma.item.count({ where: { categoryId } });
    const i = await prisma.item.create({
      data: {
        categoryId,
        name: input.name,
        nameAr: input.nameAr ?? null,
        description: input.description ?? "",
        descriptionAr: input.descriptionAr ?? null,
        priceBaisa: input.priceBaisa ?? 0,
        imageUrl: input.imageUrl ?? null,
        position: count,
      },
    });
    return toItem(i);
  }

  async updateItem(id: string, input: Partial<ItemInput>): Promise<MenuItem> {
    const i = await prisma.item.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.nameAr !== undefined ? { nameAr: input.nameAr ?? null } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.descriptionAr !== undefined ? { descriptionAr: input.descriptionAr ?? null } : {}),
        ...(input.priceBaisa !== undefined ? { priceBaisa: input.priceBaisa } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl ?? null } : {}),
      },
    });
    return toItem(i);
  }

  async deleteItem(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }

  async reorderItems(_categoryId: string, orderedIds: string[]): Promise<void> {
    await prisma.$transaction(
      orderedIds.map((id, position) =>
        prisma.item.update({ where: { id }, data: { position } }),
      ),
    );
  }
}
