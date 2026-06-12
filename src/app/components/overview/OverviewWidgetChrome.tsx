import {
  Lock,
  Maximize2,
  Minimize2,
  MinusCircle,
  MoreVertical,
  Plus,
} from "lucide-react";
import {
  SecondaryButton,
  SmallText,
  TinyText,
} from "../../../imports/UIComponents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  OVERVIEW_SECTION_META,
  resetOverviewLayout,
  type OverviewLayoutPrefs,
  type OverviewSectionId,
  type OverviewWidgetHeight,
} from "./overviewLayoutPrefs";

export function OverviewGripHandle({
  label,
  inline = false,
  draggable = true,
  disabled = false,
  className = "",
  onDragStart,
  onDragEnd,
}: {
  label: string;
  inline?: boolean;
  draggable?: boolean;
  disabled?: boolean;
  className?: string;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLButtonElement>) => void;
}) {
  const dots = (
    <span
      className="grid grid-cols-2 gap-0.5"
      style={{ width: inline ? "8px" : "10px", height: inline ? "11px" : "14px" }}
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <span
          key={index}
          className={inline ? "size-0.5 rounded-full" : "size-1 rounded-full"}
          style={{ backgroundColor: "var(--muted-foreground)" }}
        />
      ))}
    </span>
  );

  if (!draggable || disabled) {
    return (
      <span
        className={`inline-flex rounded p-0.5 opacity-70 ${className}`}
        aria-hidden
      >
        {dots}
      </span>
    );
  }

  return (
    <button
      type="button"
      draggable
      className={`cursor-grab rounded p-1 active:cursor-grabbing ${inline ? "inline-flex align-middle" : ""} ${className}`}
      aria-label={`Drag to reorder ${label}`}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {dots}
    </button>
  );
}

export function OverviewDragHandle({
  sectionId,
  locked,
  onDragStart,
  onDragEnd,
}: {
  sectionId: OverviewSectionId;
  locked?: boolean;
  onDragStart: (sectionId: OverviewSectionId) => void;
  onDragEnd: () => void;
}) {
  if (locked) {
    return (
      <span
        className="rounded p-1 opacity-40"
        aria-hidden
        title="Widget location is locked"
      >
        <OverviewGripHandle label={OVERVIEW_SECTION_META[sectionId].label} draggable={false} />
      </span>
    );
  }

  return (
    <OverviewGripHandle
      label={OVERVIEW_SECTION_META[sectionId].label}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", sectionId);
        onDragStart(sectionId);
      }}
      onDragEnd={onDragEnd}
    />
  );
}

export function OverviewWidgetFrame({
  sectionId,
  headerAddon,
  headerAction,
  locked = false,
  height = "default",
  isDragging,
  isDropTarget,
  onLockToggle,
  onMaximizeHeight,
  onMinimizeHeight,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  children,
}: {
  sectionId: OverviewSectionId;
  headerAddon?: React.ReactNode;
  headerAction?: React.ReactNode;
  locked?: boolean;
  height?: OverviewWidgetHeight;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onLockToggle: () => void;
  onMaximizeHeight: () => void;
  onMinimizeHeight: () => void;
  onRemove: () => void;
  onDragStart: (sectionId: OverviewSectionId) => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
  children: React.ReactNode;
}) {
  const meta = OVERVIEW_SECTION_META[sectionId];
  const isMinimized = height === "minimized";

  return (
    <section
      className={`mb-5 overflow-hidden rounded-md border bg-card transition-opacity ${isDragging ? "opacity-40" : ""} ${isDropTarget ? "ring-2 ring-[var(--primary)]" : ""}`}
      style={{
        borderColor: "var(--border)",
        borderRadius: "var(--radius)",
      }}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDrop={(event) => {
        event.preventDefault();
        if (locked) return;
        onDrop();
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{
          backgroundColor: "var(--muted)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <SmallText
          className="min-w-0 flex-1 truncate"
          style={{ fontWeight: "var(--font-weight-medium)" }}
        >
          {meta.label}
        </SmallText>
        {headerAddon ? <div className="shrink-0">{headerAddon}</div> : null}
        {headerAction && !isMinimized ? (
          <div className="shrink-0">{headerAction}</div>
        ) : null}
        {locked ? (
          <Lock
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-label="Location and size locked"
          />
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded border p-1 hover:bg-background/60"
              style={{ borderColor: "var(--border)" }}
              aria-label={`${meta.label} options`}
            >
              <MoreVertical className="size-4 text-muted-foreground" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0">
            <div className="p-1">
              <DropdownMenuItem onClick={onLockToggle}>
                <Lock aria-hidden />
                {locked ? "Unlock location and size" : "Lock location and size"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onMaximizeHeight}
                disabled={height === "maximized"}
              >
                <Maximize2 aria-hidden />
                Maximize height
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onMinimizeHeight}
                disabled={height === "minimized"}
              >
                <Minimize2 aria-hidden />
                Minimize height
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={onRemove}
                className="items-start py-2"
              >
                <MinusCircle aria-hidden className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block">Remove</span>
                  <TinyText
                    muted
                    className="!mt-0.5 !block font-normal leading-snug !text-muted-foreground"
                    style={{ fontSize: "var(--text-xs)" }}
                  >
                    All &apos;removed&apos; widgets can be added back by clicking
                    the &apos;Add widgets&apos; button.
                  </TinyText>
                </span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <OverviewDragHandle
          sectionId={sectionId}
          locked={locked}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </div>
      {!isMinimized ? <div>{children}</div> : null}
    </section>
  );
}

export function OverviewLayoutToolbar({
  addWidgetsOpen,
  onAddWidgetsOpenChange,
  onLayoutChange,
}: {
  addWidgetsOpen: boolean;
  onAddWidgetsOpenChange: (open: boolean) => void;
  onLayoutChange: (layout: OverviewLayoutPrefs) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        className="text-sm font-medium hover:underline"
        style={{ color: "var(--primary)" }}
        onClick={() => {
          onAddWidgetsOpenChange(false);
          onLayoutChange(resetOverviewLayout());
        }}
      >
        Reset to default
      </button>
      <SecondaryButton
        type="button"
        className={`inline-flex items-center gap-2 !px-3 !py-1.5 ${addWidgetsOpen ? "!border-[var(--primary)] !bg-[color-mix(in_srgb,var(--primary)_8%,white)]" : ""}`}
        aria-expanded={addWidgetsOpen}
        onClick={() => onAddWidgetsOpenChange(!addWidgetsOpen)}
      >
        <Plus className="size-3.5" aria-hidden />
        Add widgets
      </SecondaryButton>
    </div>
  );
}
