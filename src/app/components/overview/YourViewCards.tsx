import { useMemo, useState } from "react";
import { Link } from "react-router";
import { SmallText, TinyText } from "../../../imports/UIComponents";
import {
  overviewCopy,
  PINNED_WIDGETS,
  type OverviewWidget,
} from "./fleetOverviewDemoData";
import {
  getYourViewCardOrder,
  reorderYourViewCards,
  type OverviewLayoutPrefs,
} from "./overviewLayoutPrefs";

function YourViewCardDragHandle({
  cardId,
  label,
  onDragStart,
  onDragEnd,
}: {
  cardId: string;
  label: string;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      className="cursor-grab rounded p-1 active:cursor-grabbing"
      aria-label={`Drag to reorder ${label}`}
      onDragStart={(event) => {
        event.stopPropagation();
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", cardId);
        onDragStart(cardId);
      }}
      onDragEnd={(event) => {
        event.stopPropagation();
        onDragEnd();
      }}
    >
      <span
        className="grid grid-cols-2 gap-0.5"
        style={{ width: "10px", height: "14px" }}
        aria-hidden
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className="size-1 rounded-full"
            style={{ backgroundColor: "var(--muted-foreground)" }}
          />
        ))}
      </span>
    </button>
  );
}

function YourViewCard({
  widget,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  widget: OverviewWidget;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart: (cardId: string) => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border bg-card transition-opacity ${isDragging ? "opacity-40" : ""} ${isDropTarget ? "ring-2 ring-[var(--primary)]" : ""}`}
      style={{ borderColor: "var(--border)" }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDragOver();
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
    >
      <div
        className="flex items-center gap-1 px-2 py-1.5"
        style={{
          backgroundColor: "var(--muted)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <SmallText
          className="min-w-0 flex-1 truncate"
          style={{ fontWeight: "var(--font-weight-medium)" }}
        >
          {widget.title}
        </SmallText>
        <YourViewCardDragHandle
          cardId={widget.id}
          label={widget.title}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      </div>
      <Link
        to={widget.href}
        className="block px-3 py-3 transition-colors hover:bg-muted/30"
      >
        {widget.sourceLabel ? (
          <TinyText muted className="!mb-1 !block">
            {widget.sourceLabel}
          </TinyText>
        ) : null}
        <SmallText className="!mb-1 !block">{widget.metric}</SmallText>
        <TinyText muted className="!block">
          {widget.detail}
          {widget.trend ? ` · ${widget.trend}` : ""}
        </TinyText>
      </Link>
    </div>
  );
}

export function YourViewCards({
  layout,
  onLayoutChange,
}: {
  layout: OverviewLayoutPrefs;
  onLayoutChange: (layout: OverviewLayoutPrefs) => void;
}) {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dropTargetCardId, setDropTargetCardId] = useState<string | null>(null);

  const orderedWidgets = useMemo(() => {
    const order = getYourViewCardOrder(layout);
    const widgetsById = new Map(PINNED_WIDGETS.map((widget) => [widget.id, widget]));
    return order
      .map((id) => widgetsById.get(id))
      .filter((widget): widget is OverviewWidget => Boolean(widget));
  }, [layout]);

  return (
    <div className="p-4">
      <TinyText muted className="!mb-4 !block">
        {overviewCopy.yourViewDescription}
      </TinyText>
      {orderedWidgets.length === 0 ? (
        <div
          className="rounded-md border border-dashed px-4 py-8 text-center"
          style={{ borderColor: "var(--border)" }}
        >
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            Nothing pinned yet
          </SmallText>
          <TinyText muted className="!mt-1 !block">
            Save a search on Clusters, Security, or another page, then pin it
            here.
          </TinyText>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {orderedWidgets.map((widget) => (
            <YourViewCard
              key={widget.id}
              widget={widget}
              isDragging={draggedCardId === widget.id}
              isDropTarget={dropTargetCardId === widget.id}
              onDragStart={setDraggedCardId}
              onDragEnd={() => {
                setDraggedCardId(null);
                setDropTargetCardId(null);
              }}
              onDragOver={() => setDropTargetCardId(widget.id)}
              onDrop={() => {
                if (!draggedCardId) return;
                onLayoutChange(
                  reorderYourViewCards(layout, draggedCardId, widget.id),
                );
                setDraggedCardId(null);
                setDropTargetCardId(null);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
