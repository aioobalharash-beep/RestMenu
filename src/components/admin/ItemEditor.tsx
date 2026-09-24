"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/lib/types";
import { baisaToOmrInput, parseOmrToBaisa } from "@/lib/money";
import { resizeImage } from "@/lib/resize-image";
import { api } from "./api";

/** Modal to create or edit a dish: name, image, description, price. */
export default function ItemEditor({
  categoryId,
  item,
  onClose,
  onSaved,
  notify,
}: {
  categoryId: string;
  item: MenuItem | null;
  onClose: () => void;
  onSaved: (item: MenuItem, isNew: boolean) => void;
  notify: (msg: string, tone?: "ok" | "err") => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [nameAr, setNameAr] = useState(item?.nameAr ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(item?.descriptionAr ?? "");
  const [price, setPrice] = useState(item ? baisaToOmrInput(item.priceBaisa) : "");
  const [imageUrl, setImageUrl] = useState<string | null>(item?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !item;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const optimized = await resizeImage(file);
      const url = await api.upload(optimized);
      setImageUrl(url);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed.", "err");
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    if (!name.trim()) {
      notify("Give the dish a name.", "err");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      nameAr: nameAr.trim() || null,
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || null,
      priceBaisa: parseOmrToBaisa(price),
      imageUrl,
    };
    try {
      const saved = isNew
        ? await api.createItem({ categoryId, ...payload })
        : await api.updateItem(item!.id, payload);
      onSaved(saved, isNew);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not save.", "err");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-hairline bg-cream p-6 shadow-float">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl text-ink">
            {isNew ? "New dish" : "Edit dish"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="focus-ring -mr-1 grid h-9 w-9 place-items-center rounded-full text-ink-faint hover:bg-porcelain-deep hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="mt-5">
          <span className="text-sm font-medium text-ink-soft">Dish image</span>
          <div className="mt-2 flex items-center gap-4">
            <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full border border-hairline bg-shell">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-ink-faint">No image</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="focus-ring rounded-lg border border-hairline bg-shell px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-porcelain disabled:opacity-50"
              >
                {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
              </button>
              {imageUrl && (
                <button
                  onClick={() => setImageUrl(null)}
                  className="focus-ring text-left text-xs text-clay hover:underline"
                >
                  Remove
                </button>
              )}
              <p className="max-w-[16rem] text-xs text-ink-faint">
                Transparent PNG works best. PNG, JPG, WEBP, or SVG · up to 8&nbsp;MB.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
              className="hidden"
              onChange={onFile}
            />
          </div>
        </div>

        {/* Name (EN / AR) */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Name (English)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Seared Scallops"
              className="input"
              autoFocus
            />
          </Field>
          <Field label="الاسم (عربي)">
            <input
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: إسكالوب محمّر"
              dir="rtl"
              className="input"
            />
          </Field>
        </div>

        {/* Description (EN / AR) */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Description (English)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="A short, appetising line…"
              className="input resize-none"
            />
          </Field>
          <Field label="الوصف (عربي)">
            <textarea
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              rows={3}
              placeholder="وصف قصير وشهي…"
              dir="rtl"
              className="input resize-none"
            />
          </Field>
        </div>

        {/* Price */}
        <Field label="Price (OMR)" className="mt-4">
          <div className="relative">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              inputMode="decimal"
              placeholder="0.000"
              className="input pr-14"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-faint">
              OMR
            </span>
          </div>
        </Field>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="focus-ring rounded-xl px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploading}
            className="focus-ring rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? "Saving…" : isNew ? "Add dish" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
