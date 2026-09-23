import type { Menu, MenuCategory, MenuItem } from "@/lib/types";

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Request failed.");
  return data as T;
}

export const api = {
  getMenu: () => req<{ menu: Menu }>("/api/admin/menu").then((d) => d.menu),

  createCategory: (input: { name: string; nameAr?: string | null; kicker?: string | null }) =>
    req<{ category: MenuCategory }>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((d) => d.category),

  updateCategory: (
    id: string,
    input: { name?: string; nameAr?: string | null; kicker?: string | null },
  ) =>
    req<{ category: MenuCategory }>(`/api/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((d) => d.category),

  deleteCategory: (id: string) =>
    req(`/api/admin/categories/${id}`, { method: "DELETE" }),

  reorderCategories: (orderedIds: string[]) =>
    req("/api/admin/categories/reorder", {
      method: "POST",
      body: JSON.stringify({ orderedIds }),
    }),

  createItem: (input: {
    categoryId: string;
    name: string;
    nameAr?: string | null;
    description?: string;
    descriptionAr?: string | null;
    priceBaisa?: number;
    imageUrl?: string | null;
  }) =>
    req<{ item: MenuItem }>("/api/admin/items", {
      method: "POST",
      body: JSON.stringify(input),
    }).then((d) => d.item),

  updateItem: (
    id: string,
    input: {
      name?: string;
      nameAr?: string | null;
      description?: string;
      descriptionAr?: string | null;
      priceBaisa?: number;
      imageUrl?: string | null;
    },
  ) =>
    req<{ item: MenuItem }>(`/api/admin/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }).then((d) => d.item),

  deleteItem: (id: string) => req(`/api/admin/items/${id}`, { method: "DELETE" }),

  reorderItems: (categoryId: string, orderedIds: string[]) =>
    req("/api/admin/items/reorder", {
      method: "POST",
      body: JSON.stringify({ categoryId, orderedIds }),
    }),

  logout: () => req("/api/admin/logout", { method: "POST" }),

  async upload(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Upload failed.");
    return data.url as string;
  },
};
