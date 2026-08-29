"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GripVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "@/lib/auth-context";
import { projectsApi } from "@/lib/api";
import type { AdminProject, ProjectStatus } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { Table, TableMessage, TableSkeleton } from "@/components/ui/Table";

const COLUMNS = ["", "المشروع", "الحالة", "التقنيات", "مميّز", ""] as const;
const FILTERS: { value: ProjectStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "الكل" },
  { value: "PUBLISHED", label: "منشور" },
  { value: "DRAFT", label: "مسودّة" },
  { value: "ARCHIVED", label: "مؤرشف" },
];

function Row({
  p,
  busy,
  onToggleFeatured,
  onDelete,
}: {
  p: AdminProject;
  busy: boolean;
  onToggleFeatured: (p: AdminProject) => void;
  onDelete: (p: AdminProject) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: p.id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${isDragging ? "relative z-10 bg-surface-2 shadow-md" : ""} ${
        busy ? "opacity-50" : ""
      }`}
    >
      <td className="w-10">
        <button
          {...attributes}
          {...listeners}
          aria-label={`إعادة ترتيب ${p.title}`}
          className="cursor-grab rounded-sm p-1 text-ink-300 hover:bg-surface-2 hover:text-fg active:cursor-grabbing"
        >
          <GripVertical size={16} aria-hidden />
        </button>
      </td>

      <td>
        <div className="font-bold">{p.title}</div>
        <p className="mt-1 font-mono text-xs text-fg-muted">/{p.slug}</p>
      </td>

      <td><StatusBadge status={p.status} /></td>

      <td>
        <div className="flex flex-wrap gap-1">
          {p.technologies.slice(0, 3).map((t) => (
            <Badge key={t} tone="info">{t}</Badge>
          ))}
          {p.technologies.length > 3 && <Badge>+{p.technologies.length - 3}</Badge>}
        </div>
      </td>

      <td>
        <button
          onClick={() => onToggleFeatured(p)}
          disabled={busy}
          aria-pressed={p.featured}
          aria-label={p.featured ? `إلغاء تمييز ${p.title}` : `تمييز ${p.title}`}
          className="rounded-sm p-1 transition-fast hover:bg-surface-2"
        >
          <Star
            size={17}
            aria-hidden
            className={p.featured ? "fill-gold-500 text-gold-500" : "text-ink-300"}
          />
        </button>
      </td>

      <td>
        <div className="flex justify-end gap-2">
          <Link
            href={`/dashboard/projects/${p.id}/edit`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Pencil size={14} aria-hidden /> تعديل
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(p)}
            disabled={busy}
            aria-label={`حذف ${p.title}`}
          >
            <Trash2 size={14} aria-hidden />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<AdminProject[]>();
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectStatus | "ALL">("ALL");
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    /* عتبة ٨ بكسل: بدونها يصير كل نقر على زر داخل الصف بداية سحب */
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const res = await projectsApi.list(token, { limit: 48, sort: "order", order: "asc" });
      setProjects(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تحميل المشاريع");
      setProjects([]);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function toggleFeatured(p: AdminProject) {
    setBusyId(p.id);
    setProjects((prev) =>
      prev?.map((x) => (x.id === p.id ? { ...x, featured: !x.featured } : x)),
    );
    try {
      await projectsApi.update(token!, p.id, { featured: !p.featured });
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر التحديث");
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: AdminProject) {
    if (!confirm(`حذف «${p.title}» نهائياً؟ ستُحذف صوره ومؤشراته معه.`)) return;
    setBusyId(p.id);
    try {
      await projectsApi.delete(token!, p.id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحذف");
    } finally {
      setBusyId(null);
    }
  }

  async function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id || !projects) return;

    /* الترتيب يُحسب على المعروض لا على القائمة الكاملة: مع فلتر نشط كانت
       الفهارس تؤخذ من قائمة فيها بطاقات مخفيّة، فتهبط البطاقة في موضع
       غير الذي أُفلتت فيه. */
    const shown = projects.filter((p) => filter === "ALL" || p.status === filter);
    const from = shown.findIndex((p) => p.id === active.id);
    const to = shown.findIndex((p) => p.id === over.id);
    if (from < 0 || to < 0) return;

    const moved = arrayMove(shown, from, to);
    /* المخفيّ يبقى في مكانه: البطاقات الظاهرة وحدها تتبادل مواضعها. */
    const shownIds = new Set(shown.map((p) => p.id));
    const next = [...projects];
    let cursor = 0;
    for (let i = 0; i < next.length; i++) {
      if (shownIds.has(next[i].id)) next[i] = moved[cursor++];
    }

    /* تحديث متفائل ثم حفظ: السحب يجب أن يبدو فورياً، والخادم يؤكّد. */
    setProjects(next);
    setSaving(true);
    try {
      await projectsApi.reorder(
        token!,
        next.map((p, i) => ({ id: p.id, order: i + 1 })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر حفظ الترتيب");
      await load(); // ارجع إلى ترتيب الخادم
    } finally {
      setSaving(false);
    }
  }

  const visible = projects?.filter((p) => filter === "ALL" || p.status === filter);
  const counts = {
    total: projects?.length ?? 0,
    published: projects?.filter((p) => p.status === "PUBLISHED").length ?? 0,
    featured: projects?.filter((p) => p.featured).length ?? 0,
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">معرض الأعمال</h1>
          {projects && (
            <p className="mt-1 font-mono text-xs tracking-wider text-fg-muted">
              {counts.total} مشروعاً · {counts.published} منشور · {counts.featured} مميّز
            </p>
          )}
        </div>
        <Link href="/dashboard/projects/new" className={`ms-auto ${buttonVariants()}`}>
          <Plus size={16} aria-hidden /> مشروع جديد
        </Link>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`rounded-sm border px-4 py-1.5 font-mono text-xs transition-fast ${
              filter === f.value
                ? "border-primary-500 bg-primary-500 text-fg-onPrimary"
                : "border-border-strong text-fg-muted hover:border-primary-500 hover:text-primary-500"
            }`}
          >
            {f.label}
          </button>
        ))}
        {saving && (
          <span className="ms-auto font-mono text-xs text-fg-muted">جارٍ حفظ الترتيب…</span>
        )}
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-sm border border-danger bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <p className="mb-3 font-mono text-[11px] text-fg-muted">
        اسحب من المقبض لإعادة الترتيب — الترتيب هو ما يظهر به المعرض في الموقع.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <Table>
          <thead>
            <tr>{COLUMNS.map((c, i) => <th key={i}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {!projects ? (
              <TableSkeleton cols={COLUMNS.length} />
            ) : !visible?.length ? (
              <TableMessage colSpan={COLUMNS.length}>
                {filter === "ALL"
                  ? "لا مشاريع بعد — ابدأ بإضافة أول عمل"
                  : "لا مشاريع بهذه الحالة"}
              </TableMessage>
            ) : (
              <SortableContext
                items={visible.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {visible.map((p) => (
                  <Row
                    key={p.id}
                    p={p}
                    busy={busyId === p.id}
                    onToggleFeatured={toggleFeatured}
                    onDelete={remove}
                  />
                ))}
              </SortableContext>
            )}
          </tbody>
        </Table>
      </DndContext>
    </div>
  );
}
