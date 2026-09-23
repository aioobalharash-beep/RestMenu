"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { Menu, MenuCategory, MenuItem } from "@/lib/types";
import { api } from "./api";
import { brand } from "@/brand.config";
import CategoryCard from "./CategoryCard";
import ItemEditor from "./ItemEditor";

type EditorState = { categoryId: string; item: MenuItem | null } | null;
type Toast = { msg: string; tone: "ok" | "err" } | null;

export default function AdminDashboard({
  initialMenu,
  backend,
}: {
  initialMenu: Menu;
  backend: "postgres" | "json";
}) {
  const router = useRouter();
  const [cats, setCats] = useState<Menu>(initialMenu);
  const [editor, setEditor] = useState<EditorState>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [newName, setNewName] = useState("");
  const [newNameAr, setNewNameAr] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const notify = useCallback((msg: string, tone: "ok" | "err" = "ok") => {
    setToast({ msg, tone });
    window.clearTimeout((notify as unknown as { t?: number }).t);
    (notify as unknown as { t?: number }).t = window.setTimeout(
      () => setToast(null),
      2600,
    );
  }, []);

  const resync = useCallback(async () => {
    try {
      setCats(await api.getMenu());
    } catch {
      /* leave optimistic state */
    }
  }, []);

  // --- Categories ---
  async function addCategory() {
    const name = newName.trim();
    if (!name) return;
    setAddingCategory(true);
    try {
      const category = await api.createCategory({ name, nameAr: newNameAr.trim() || null, kicker: null });
      setCats((c) => [...c, category]);
      setNewName("");
      setNewNameAr("");
      notify("Category added.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not add category.", "err");
    } finally {
      setAddingCategory(false);
    }
  }

  async function renameCategory(
    id: string,
    name: string,
    nameAr: string | null,
    kicker: string | null,
  ) {
    setCats((c) => c.map((x) => (x.id === id ? { ...x, name, nameAr, kicker } : x)));
    try {
      await api.updateCategory(id, { name, nameAr, kicker });
      notify("Category updated.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Update failed.", "err");
      resync();
    }
  }

  async function deleteCategory(id: string) {
    const cat = cats.find((c) => c.id === id);
    if (!confirm(`Delete “${cat?.name}” and all its dishes? This cannot be undone.`)) return;
    setCats((c) => c.filter((x) => x.id !== id));
    try {
      await api.deleteCategory(id);
      notify("Category deleted.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Delete failed.", "err");
      resync();
    }
  }

  async function moveCategory(id: string, dir: -1 | 1) {
    const idx = cats.findIndex((c) => c.id === id);
    const target = idx + dir;
    if (target < 0 || target >= cats.length) return;
    const next = [...cats];
    [next[idx], next[target]] = [next[target], next[idx]];
    setCats(next);
    try {
      await api.reorderCategories(next.map((c) => c.id));
    } catch {
      notify("Reorder failed.", "err");
      resync();
    }
  }

  // --- Items ---
  function upsertItemLocal(categoryId: string, item: MenuItem, isNew: boolean) {
    setCats((c) =>
      c.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const items = isNew
          ? [...cat.items, item]
          : cat.items.map((it) => (it.id === item.id ? item : it));
        return { ...cat, items };
      }),
    );
  }

  async function deleteItem(categoryId: string, item: MenuItem) {
    if (!confirm(`Delete “${item.name}”?`)) return;
    setCats((c) =>
      c.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((it) => it.id !== item.id) }
          : cat,
      ),
    );
    try {
      await api.deleteItem(item.id);
      notify("Dish deleted.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Delete failed.", "err");
      resync();
    }
  }

  async function moveItem(category: MenuCategory, item: MenuItem, dir: -1 | 1) {
    const idx = category.items.findIndex((it) => it.id === item.id);
    const target = idx + dir;
    if (target < 0 || target >= category.items.length) return;
    const items = [...category.items];
    [items[idx], items[target]] = [items[target], items[idx]];
    setCats((c) => c.map((cat) => (cat.id === category.id ? { ...cat, items } : cat)));
    try {
      await api.reorderItems(category.id, items.map((it) => it.id));
    } catch {
      notify("Reorder failed.", "err");
      resync();
    }
  }

  async function logout() {
    await api.logout().catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-porcelain text-ink">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-display text-lg text-ink">RestMenu</span>
            <span className="hidden shrink-0 rounded-full bg-porcelain-deep px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-ink-faint sm:inline">
              {backend === "postgres" ? "Postgres" : "Local"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            {brand.features.ordering && (
              <>
                <a
                  href="/admin/orders"
                  className="focus-ring whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-porcelain-deep hover:text-ink sm:px-3"
                >
                  Orders
                </a>
                <a
                  href="/admin/tables"
                  className="focus-ring hidden whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-porcelain-deep hover:text-ink sm:inline-block sm:px-3"
                >
                  Tables
                </a>
              </>
            )}
            <a
              href="/"
              target="_blank"
              className="focus-ring whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-porcelain-deep hover:text-ink sm:px-3"
            >
              View&nbsp;menu ↗
            </a>
            <button
              onClick={logout}
              className="focus-ring whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-porcelain-deep hover:text-ink sm:px-3"
            >
              Log&nbsp;out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-light">Menu</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Add courses and dishes. Changes are live on the menu immediately.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {cats.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              isFirst={i === 0}
              isLast={i === cats.length - 1}
              onRename={(name, nameAr, kicker) => renameCategory(category.id, name, nameAr, kicker)}
              onDelete={() => deleteCategory(category.id)}
              onMove={(dir) => moveCategory(category.id, dir)}
              onAddItem={() => setEditor({ categoryId: category.id, item: null })}
              onEditItem={(item) => setEditor({ categoryId: category.id, item })}
              onDeleteItem={(item) => deleteItem(category.id, item)}
              onMoveItem={(item, dir) => moveItem(category, item, dir)}
            />
          ))}
        </div>

        {/* Add category */}
        <div className="mt-5 rounded-2xl border border-dashed border-hairline bg-cream/50 p-5">
          <h3 className="font-display text-lg text-ink">Add a course</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Course name — e.g. Desserts"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <input
              value={newNameAr}
              onChange={(e) => setNewNameAr(e.target.value)}
              placeholder="اسم القسم (عربي)"
              dir="rtl"
              className="input"
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <button
              onClick={addCategory}
              disabled={addingCategory || !newName.trim()}
              className="focus-ring rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </main>

      {editor && (
        <ItemEditor
          categoryId={editor.categoryId}
          item={editor.item}
          notify={notify}
          onClose={() => setEditor(null)}
          onSaved={(item, isNew) => {
            upsertItemLocal(editor.categoryId, item, isNew);
            setEditor(null);
            notify(isNew ? "Dish added." : "Dish updated.");
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2.5 text-sm font-medium text-cream shadow-lift"
          style={{
            background: toast.tone === "err" ? "var(--color-clay)" : "var(--color-ink)",
          }}
          role="status"
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
