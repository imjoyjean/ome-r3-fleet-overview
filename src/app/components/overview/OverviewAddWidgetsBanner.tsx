import {
  AlertTriangle,
  BarChart3,
  Bookmark,
  GitBranch,
  LayoutGrid,
  Layers,
  Lightbulb,
  ListChecks,
  PieChart,
  Siren,
  TrendingDown,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { SmallText, TinyText } from "../../../imports/UIComponents";
import {
  hiddenOverviewSections,
  OVERVIEW_SECTION_META,
  type OverviewLayoutPrefs,
  type OverviewSectionId,
} from "./overviewLayoutPrefs";
import { OverviewGripHandle } from "./OverviewWidgetChrome";

const OVERVIEW_SECTION_ICONS: Record<OverviewSectionId, LucideIcon> = {
  "getting-started": ListChecks,
  "fleet-summary": LayoutGrid,
  attention: AlertTriangle,
  "fleet-rollouts": GitBranch,
  recommendations: Lightbulb,
  "pinned-insights": Bookmark,
  "capacity-chart": BarChart3,
  "version-distribution": Layers,
  "health-by-group": Users,
  "active-incidents": Siren,
  "slo-error-budgets": PieChart,
  "mttr-trend": TrendingDown,
};

function AddWidgetPaletteCard({
  sectionId,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  sectionId: OverviewSectionId;
  isDragging?: boolean;
  onDragStart: (sectionId: OverviewSectionId) => void;
  onDragEnd: () => void;
}) {
  const meta = OVERVIEW_SECTION_META[sectionId];
  const Icon = OVERVIEW_SECTION_ICONS[sectionId];

  return (
    <div
      className={`flex min-w-[220px] flex-1 items-center gap-3 rounded-md border bg-card px-3 py-2.5 shadow-sm transition-opacity ${isDragging ? "opacity-40" : ""}`}
      style={{ borderColor: "var(--border)" }}
    >
      <Icon
        className="size-5 shrink-0"
        style={{ color: "var(--primary)" }}
        aria-hidden
      />
      <SmallText
        className="min-w-0 flex-1 truncate"
        style={{ fontWeight: "var(--font-weight-medium)" }}
      >
        {meta.label}
      </SmallText>
      <OverviewGripHandle
        label={meta.label}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", sectionId);
          onDragStart(sectionId);
        }}
        onDragEnd={onDragEnd}
      />
    </div>
  );
}

export function OverviewAddWidgetsBanner({
  layout,
  draggedSectionId,
  onClose,
  onDragStart,
  onDragEnd,
}: {
  layout: OverviewLayoutPrefs;
  draggedSectionId: OverviewSectionId | null;
  onClose: () => void;
  onDragStart: (sectionId: OverviewSectionId) => void;
  onDragEnd: () => void;
}) {
  const hidden = hiddenOverviewSections(layout);

  return (
    <section
      className="relative mb-5 rounded-md border px-4 py-4 sm:px-5"
      style={{
        borderColor: "color-mix(in srgb, var(--primary) 28%, var(--border))",
        backgroundColor: "color-mix(in srgb, var(--primary) 10%, white)",
      }}
      aria-label="Add widgets"
    >
      <button
        type="button"
        className="absolute right-3 top-3 rounded p-1 hover:bg-background/60"
        aria-label="Close add widgets"
        onClick={onClose}
      >
        <X className="size-4 text-muted-foreground" aria-hidden />
      </button>

      <TinyText className="!mb-4 !block max-w-3xl pr-8 leading-relaxed">
        Add new and previously removed widgets by clicking the{" "}
        <OverviewGripHandle
          label="widget"
          inline
          className="mx-0.5 align-middle"
          draggable={false}
        />{" "}
        icon, then drag and drop to a new location on your Overview.
      </TinyText>

      {hidden.length === 0 ? (
        <TinyText muted className="!block">
          All widgets are already on your Overview. Remove a widget to add it
          back here.
        </TinyText>
      ) : (
        <div className="flex flex-wrap gap-3">
          {hidden.map((section) => (
            <AddWidgetPaletteCard
              key={section.id}
              sectionId={section.id}
              isDragging={draggedSectionId === section.id}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </section>
  );
}
