"use client";

import { useState } from "react";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { formatOmr } from "@/lib/money";
import IconButton from "./IconButton";

/** One category: editable header + reorderable item rows + "add dish". */
export default function CategoryCard({
  category,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItem,
}: {
  category: MenuCategory;
  isFirst: boolean;
  isLast: boolean;
  onRename: (name: string, kicker: string | null) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (item: MenuItem) => void;
  onMoveItem: (item: MenuItem, dir: -1 | 1) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [kicker, setKicker] = useState(category.kicker ?? "");

  function save() {
    if (!name.trim()) return;
    onRename(name.trim(), kicker.trim() || null);
    setEditing(false);
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-cream shadow-soft">
      {/* Header */}
      <header className="flex items-start gap-3 border-b border-hairline-soft bg-shell/60 px-4 py-4 sm:px-5">
        <div className="mt-0.5 flex flex-col gap-1">
          <IconButton label="Move category up" disabled={isFirst} onClick={() => onMove(-1)} icon="up" small />
          <IconButton label="Move category down" disabled={isLast} onClick={() => onMove(1)} icon="down" small />
        </div>

        {editing ? (
          <div className="flex-1">
            <input
              value={kicker}
              onChange={(e) => setKicker(e.target.value)}
              placeholder="Kicker (optional) — e.g. To begin"
              className="input mb-2 text-sm"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="input font-display"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && save()}
            />
            <div className="mt-2 flex gap-2">
              <button onClick={save} className="focus-ring rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-cream">
                Save
              </button>
              <button
                onClick={() => {
                  setName(category.name);
                  setKicker(category.kicker ?? "");
                  setEditing(false);
                }}
                className="focus-ring rounded-lg px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            {category.kicker && (
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-saffron-deep">
                {category.kicker}
              </span>
            )}
            <h2 className="font-display text-2xl leading-tight text-ink">{category.name}</h2>
            <p className="mt-0.5 text-xs text-ink-faint">
              {category.items.length} {category.items.length === 1 ? "dish" : "dishes"}
            </p>
          </div>
        )}

        {!editing && (
          <div className="flex gap-1">
            <IconButton label="Edit category" onClick={() => setEditing(true)} icon="edit" />
            <IconButton label="Delete category" onClick={onDelete} icon="trash" danger />
          </div>
        )}
      </header>

      {/* Items */}
      <ul className="divide-y divide-hairline-soft">
        {category.items.map((item, i) => (
          <li key={item.id} className="flex items-center gap-2 px-3 py-3 sm:gap-3 sm:px-5">
            <div className="flex flex-col">
              <IconButton label="Move up" disabled={i === 0} onClick={() => onMoveItem(item, -1)} icon="up" small />
              <IconButton label="Move down" disabled={i === category.items.length - 1} onClick={() => onMoveItem(item, 1)} icon="down" small />
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-hairline bg-shell">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-[0.6rem] text-ink-faint">—</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{item.name}</p>
              <p className="truncate text-xs text-ink-faint">
                <span className="font-medium text-ink-soft">
                  {formatOmr(item.priceBaisa)} <span className="tracking-wider">OMR</span>
                </span>
                {item.description ? <span className="text-ink-faint"> · {item.description}</span> : null}
              </p>
            </div>
            <div className="flex shrink-0">
              <IconButton label="Edit dish" onClick={() => onEditItem(item)} icon="edit" />
              <IconButton label="Delete dish" onClick={() => onDeleteItem(item)} icon="trash" danger />
            </div>
          </li>
        ))}
        {category.items.length === 0 && (
          <li className="px-5 py-6 text-center text-sm text-ink-faint">
            No dishes yet.
          </li>
        )}
      </ul>

      {/* Footer */}
      <div className="border-t border-hairline-soft px-4 py-3 sm:px-5">
        <button
          onClick={onAddItem}
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-saffron-deep transition-colors hover:bg-porcelain"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add dish
        </button>
      </div>
    </section>
  );
}
