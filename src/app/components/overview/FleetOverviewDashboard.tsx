import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  GettingStartedChecklist,
  getGettingStartedProgress,
} from "../GettingStartedChecklist";
import {
  Badge,
  PageTitle,
  SecondaryButton,
  SmallText,
  StatusDot,
  TinyText,
} from "../../../imports/UIComponents";
import { deploymentCopy } from "../deployments/deploymentPrototypeCopy";
import { runChannelLabel } from "../deployments/fleetRolloutDemoData";
import {
  ATTENTION_ITEMS,
  ACTIVE_INCIDENTS,
  DETECTED_RECOMMENDATIONS,
  FLEET_HEALTH_SIGNALS,
  FLEET_SUMMARY_STATS,
  getOverviewActiveRollouts,
  getMorningAfterDetail,
  getMorningAfterSummary,
  overviewCopy,
  rolloutStatusLabel,
  rolloutStatusVariant,
  summarizeRolloutProgress,
  type AttentionItem,
  type AttentionSeverity,
  type FleetHealthSignal,
} from "./fleetOverviewDemoData";
import { OverviewAddWidgetsBanner } from "./OverviewAddWidgetsBanner";
import {
  ActiveIncidentsWidgetPanel,
  FleetCapacityWidgetPanel,
  FleetHealthByGroupWidgetPanel,
  MttrWidgetPanel,
  SloErrorBudgetsWidgetPanel,
  VersionDistributionWidgetPanel,
} from "./OverviewOptionalWidgetPanels";
import {
  OverviewLayoutToolbar,
  OverviewWidgetFrame,
} from "./OverviewWidgetChrome";
import { YourViewCards } from "./YourViewCards";
import {
  addOverviewSectionAt,
  appendOverviewSection,
  isOverviewSectionVisible,
  loadOverviewLayout,
  reorderOverviewSections,
  saveOverviewLayout,
  setOverviewSectionHeight,
  setOverviewSectionLocked,
  setOverviewSectionVisible,
  visibleOverviewSections,
  type OverviewSectionId,
} from "./overviewLayoutPrefs";

function severityDot(severity: AttentionSeverity) {
  switch (severity) {
    case "critical":
      return "error" as const;
    case "warning":
      return "warning" as const;
    default:
      return "info" as const;
  }
}

function healthDot(status: FleetHealthSignal["status"]) {
  switch (status) {
    case "healthy":
      return "success" as const;
    case "warning":
      return "warning" as const;
    case "critical":
      return "error" as const;
    default:
      return "info" as const;
  }
}

function SecondarySignalTile({ signal }: { signal: FleetHealthSignal }) {
  return (
    <Link
      to={signal.href}
      className="rounded-md border px-3 py-2 transition-colors hover:bg-muted/30"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mb-0.5 flex items-center gap-1.5">
        <StatusDot status={healthDot(signal.status)} />
        <TinyText style={{ fontWeight: "var(--font-weight-medium)" }}>
          {signal.label}
        </TinyText>
      </div>
      <SmallText className="!block">{signal.summary}</SmallText>
      {signal.detail ? (
        <TinyText muted className="!mt-0.5 !block">
          {signal.detail}
        </TinyText>
      ) : null}
    </Link>
  );
}

function FleetSummaryPanel() {
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-3 xl:grid-cols-5">
        {FLEET_SUMMARY_STATS.map((stat) => (
          <Link
            key={stat.id}
            to={stat.href}
            className="rounded-md border px-4 py-3 transition-colors hover:bg-muted/30"
            style={{ borderColor: "var(--border)" }}
          >
            <TinyText muted className="!mb-1 !block">
              {stat.label}
            </TinyText>
            <div
              className="leading-none"
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--font-weight-medium)",
              }}
            >
              {stat.value}
            </div>
            {stat.trend ? (
              <TinyText
                className="!mt-1 !block"
                style={{ color: "var(--chart-4)" }}
              >
                {stat.trend}
              </TinyText>
            ) : null}
            <TinyText muted className="!mt-1 !block">
              {stat.status}
            </TinyText>
          </Link>
        ))}
      </div>

      <Collapsible open={secondaryOpen} onOpenChange={setSecondaryOpen}>
        <CollapsibleTrigger
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {overviewCopy.fleetHealth}
          </SmallText>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform ${secondaryOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {FLEET_HEALTH_SIGNALS.map((signal) => (
              <SecondarySignalTile key={signal.id} signal={signal} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

function CompactAttentionRow({ item }: { item: AttentionItem }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <StatusDot status={severityDot(item.severity)} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {item.title}
          </SmallText>
          <TinyText muted className="truncate">
            {item.description}
          </TinyText>
        </div>
      </div>
      <Link
        to={item.href}
        className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium hover:underline"
        style={{ color: "var(--primary)" }}
      >
        {item.hrefLabel}
        <ChevronRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

function formatCompletedAt(d: Date): string {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function LastCompletedRolloutSection() {
  const summary = getMorningAfterSummary();
  const detail = getMorningAfterDetail();
  const [expanded, setExpanded] = useState(false);

  if (!summary || !detail) return null;

  const completedAt = detail.endTime ? formatCompletedAt(detail.endTime) : null;

  return (
    <div
      className="mx-4 mt-4 mb-5 rounded-md border"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "rgba(62, 134, 53, 0.04)",
      }}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <TinyText muted>{overviewCopy.lastCompletedRollout}</TinyText>
            {completedAt ? (
              <>
                <TinyText muted aria-hidden>
                  ·
                </TinyText>
                <TinyText muted>{overviewCopy.morningAfterHint}</TinyText>
                <TinyText muted aria-hidden>
                  ·
                </TinyText>
                <TinyText muted>Completed {completedAt}</TinyText>
              </>
            ) : null}
          </div>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.action}
          </SmallText>
          <TinyText muted className="!mt-1.5 !block font-mono">
            {detail.actionTargets}
          </TinyText>
          <TinyText muted className="!mt-1 !block">
            {detail.startedByLabel ?? runChannelLabel(detail.runChannel)}
            {detail.affectedClusters
              ? ` · ${detail.affectedClusters} clusters`
              : null}
          </TinyText>
          <TinyText muted className="!mt-1 !block">
            {summary.morningAfterHeadline}
          </TinyText>
        </div>
        <ChevronDown
          className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {!expanded ? (
        summary.auditRef || summary.durationLabel ? (
          <div
            className="px-4 py-3.5"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <TinyText muted className="!block">
              {summary.durationLabel}
              {summary.auditRef
                ? ` · ${deploymentCopy.fleetRolloutDetail.changeTicket} ${summary.auditRef}`
                : null}
            </TinyText>
          </div>
        ) : null
      ) : (
        <div className="px-4 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <TinyText muted className="!mb-3 !block">
            {summary.verifiedAtLabel}
            {summary.auditRef
              ? ` · ${deploymentCopy.fleetRolloutDetail.changeTicket} ${summary.auditRef}`
              : null}
          </TinyText>
          <Link
            to={`${deploymentCopy.fleetRollout.basePath}/fleet-patch-004`}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            View rollout
          </Link>
        </div>
      )}
    </div>
  );
}

function DenseTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead style={{ borderBottom: "1px solid var(--border)" }}>
          <tr>
            {headers.map((header) => (
              <th
                key={header || "actions"}
                className="px-4 py-2"
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--font-weight-medium)",
                  color: "var(--muted-foreground)",
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function FleetOverviewDashboard() {
  const gettingStarted = getGettingStartedProgress();
  const [layout, setLayout] = useState(loadOverviewLayout);
  const [addWidgetsOpen, setAddWidgetsOpen] = useState(false);
  const [draggedSectionId, setDraggedSectionId] = useState<OverviewSectionId | null>(
    null,
  );
  const [dropTargetId, setDropTargetId] = useState<OverviewSectionId | "end" | null>(
    null,
  );
  const [checklistOpen, setChecklistOpen] = useState(
    gettingStarted.completed < gettingStarted.total,
  );
  const {
    preview: visibleRollouts,
    all: allActiveRollouts,
    hiddenCount: hiddenRolloutCount,
  } = getOverviewActiveRollouts();

  useEffect(() => {
    saveOverviewLayout(layout);
  }, [layout]);

  const clearDragState = () => {
    setDraggedSectionId(null);
    setDropTargetId(null);
  };

  const handleWidgetDrop = (targetId: OverviewSectionId) => {
    if (!draggedSectionId) return;

    if (isOverviewSectionVisible(layout, draggedSectionId)) {
      setLayout(reorderOverviewSections(layout, draggedSectionId, targetId));
    } else {
      setLayout(addOverviewSectionAt(layout, draggedSectionId, targetId));
    }
    clearDragState();
  };

  const handleWidgetDropAtEnd = () => {
    if (!draggedSectionId) return;
    setLayout(appendOverviewSection(layout, draggedSectionId));
    clearDragState();
  };

  const overviewSectionHeaderAddon = (sectionId: OverviewSectionId) => {
    switch (sectionId) {
      case "attention":
        return <Badge variant="destructive">{ATTENTION_ITEMS.length}</Badge>;
      case "fleet-rollouts":
        return (
          <Badge variant="info">{allActiveRollouts.length} in progress</Badge>
        );
      case "recommendations":
        return (
          <Badge variant="default">{DETECTED_RECOMMENDATIONS.length}</Badge>
        );
      case "active-incidents":
        return <Badge variant="warning">{ACTIVE_INCIDENTS.length}</Badge>;
      default:
        return null;
    }
  };

  const overviewSectionHeaderAction = (sectionId: OverviewSectionId) => {
    switch (sectionId) {
      case "fleet-rollouts":
        return (
          <Link
            to={deploymentCopy.fleetRollout.basePath}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {overviewCopy.viewAllRolloutsCount(allActiveRollouts.length)}
          </Link>
        );
      case "capacity-chart":
      case "slo-error-budgets":
      case "mttr-trend":
      case "active-incidents":
        return (
          <Link
            to="/observability"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {sectionId === "active-incidents"
              ? overviewCopy.openObservability
              : overviewCopy.viewInObservability}
          </Link>
        );
      case "version-distribution":
        return (
          <Link
            to="/fleetrollout"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            Plan upgrade rollout
          </Link>
        );
      case "health-by-group":
        return (
          <Link
            to="/clusters"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--primary)" }}
          >
            {overviewCopy.viewClusters}
          </Link>
        );
      default:
        return null;
    }
  };

  const renderOverviewSection = (sectionId: OverviewSectionId) => {
    switch (sectionId) {
      case "getting-started":
        return (
          <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <TinyText muted>
                {gettingStarted.completed} of {gettingStarted.total} completed
              </TinyText>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform ${checklistOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </CollapsibleTrigger>
              <CollapsibleContent
                className="px-4 pb-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <GettingStartedChecklist embedded />
              </CollapsibleContent>
          </Collapsible>
        );
      case "fleet-summary":
        return <FleetSummaryPanel />;
      case "attention":
        return (
          <>
            {ATTENTION_ITEMS.map((item) => (
              <CompactAttentionRow key={item.id} item={item} />
            ))}
          </>
        );
      case "fleet-rollouts":
        return (
          <>
            <LastCompletedRolloutSection />
            <div
              className="flex items-center justify-between px-4 pb-1 pt-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
                {overviewCopy.rolloutsInProgress}
              </SmallText>
            </div>
            <DenseTable headers={["Rollout", "Status", "Progress", "Scope", "Source", ""]}>
              {visibleRollouts.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-muted/20"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-2.5">
                    <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
                      {activity.action}
                    </SmallText>
                    <TinyText muted className="!block font-mono">
                      {activity.actionTargets}
                    </TinyText>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={rolloutStatusVariant(activity)}>
                      {rolloutStatusLabel(activity)}
                    </Badge>
                  </td>
                  <td className="px-4 py-2.5">
                    <SmallText>{summarizeRolloutProgress(activity)}</SmallText>
                  </td>
                  <td className="px-4 py-2.5">
                    <SmallText>{activity.resource}</SmallText>
                  </td>
                  <td className="px-4 py-2.5">
                    <SmallText>{runChannelLabel(activity.runChannel)}</SmallText>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {activity.drilldownAvailable !== false ? (
                      <Link
                        to={`${deploymentCopy.fleetRollout.basePath}/${activity.id}`}
                        className="text-sm font-medium hover:underline"
                        style={{ color: "var(--primary)" }}
                      >
                        Open
                      </Link>
                    ) : (
                      <TinyText muted>—</TinyText>
                    )}
                  </td>
                </tr>
              ))}
            </DenseTable>
            {hiddenRolloutCount > 0 ? (
              <div
                className="px-4 py-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <TinyText muted className="!block">
                  {overviewCopy.rolloutsShowing(
                    visibleRollouts.length,
                    allActiveRollouts.length,
                  )}
                </TinyText>
              </div>
            ) : null}
          </>
        );
      case "recommendations":
        return (
          <>
            {DETECTED_RECOMMENDATIONS.map((rec, index) => (
              <div
                key={rec.id}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{
                  borderTop: index > 0 ? "1px solid var(--border)" : undefined,
                }}
              >
                <Badge variant="default" className="shrink-0">
                  {rec.scope}
                </Badge>
                <div className="min-w-0 flex-1">
                  <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
                    {rec.title}
                  </SmallText>
                  <TinyText muted className="!block truncate">
                    {rec.description}
                  </TinyText>
                </div>
                <Link
                  to={rec.href}
                  className="inline-flex shrink-0 items-center gap-0.5 text-sm font-medium hover:underline"
                  style={{ color: "var(--primary)" }}
                >
                  {rec.hrefLabel}
                  <ChevronRight className="size-3.5" aria-hidden />
                </Link>
              </div>
            ))}
          </>
        );
      case "pinned-insights":
        return <YourViewCards layout={layout} onLayoutChange={setLayout} />;
      case "capacity-chart":
        return <FleetCapacityWidgetPanel />;
      case "version-distribution":
        return <VersionDistributionWidgetPanel />;
      case "health-by-group":
        return <FleetHealthByGroupWidgetPanel />;
      case "active-incidents":
        return <ActiveIncidentsWidgetPanel />;
      case "slo-error-budgets":
        return <SloErrorBudgetsWidgetPanel />;
      case "mttr-trend":
        return <MttrWidgetPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <PageTitle className="!mb-0">{overviewCopy.pageTitle}</PageTitle>
          <TinyText muted className="!mt-1 !block max-w-2xl leading-relaxed">
            {overviewCopy.pageSubtitle}
          </TinyText>
          <TinyText muted className="!mt-1 !block">
            {overviewCopy.lastUpdated}
          </TinyText>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <OverviewLayoutToolbar
            addWidgetsOpen={addWidgetsOpen}
            onAddWidgetsOpenChange={setAddWidgetsOpen}
            onLayoutChange={setLayout}
          />
          <SecondaryButton type="button" className="inline-flex items-center gap-2 !px-3 !py-1.5">
            <RefreshCw className="size-3.5" aria-hidden />
            Refresh
          </SecondaryButton>
        </div>
      </header>

      {addWidgetsOpen ? (
        <OverviewAddWidgetsBanner
          layout={layout}
          draggedSectionId={draggedSectionId}
          onClose={() => setAddWidgetsOpen(false)}
          onDragStart={setDraggedSectionId}
          onDragEnd={clearDragState}
        />
      ) : null}

      {visibleOverviewSections(layout).map((section) => (
        <OverviewWidgetFrame
          key={section.id}
          sectionId={section.id}
          headerAddon={overviewSectionHeaderAddon(section.id)}
          headerAction={overviewSectionHeaderAction(section.id)}
          locked={section.locked}
          height={section.height}
          isDragging={draggedSectionId === section.id}
          isDropTarget={dropTargetId === section.id && !section.locked}
          onLockToggle={() =>
            setLayout(
              setOverviewSectionLocked(layout, section.id, !section.locked),
            )
          }
          onMaximizeHeight={() =>
            setLayout(setOverviewSectionHeight(layout, section.id, "maximized"))
          }
          onMinimizeHeight={() =>
            setLayout(setOverviewSectionHeight(layout, section.id, "minimized"))
          }
          onRemove={() =>
            setLayout(setOverviewSectionVisible(layout, section.id, false))
          }
          onDragStart={setDraggedSectionId}
          onDragEnd={clearDragState}
          onDragOver={() => {
            if (!section.locked) {
              setDropTargetId(section.id);
            }
          }}
          onDrop={() => handleWidgetDrop(section.id)}
        >
          {renderOverviewSection(section.id)}
        </OverviewWidgetFrame>
      ))}

      {addWidgetsOpen ? (
        <div
          className={`mb-5 rounded-md border border-dashed px-4 py-5 text-center transition-colors ${dropTargetId === "end" ? "bg-muted/20 ring-2 ring-[var(--primary)]" : ""}`}
          style={{ borderColor: "var(--border)" }}
          onDragOver={(event) => {
            event.preventDefault();
            setDropTargetId("end");
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleWidgetDropAtEnd();
          }}
        >
          <TinyText muted>Drop a widget here to add it at the bottom</TinyText>
        </div>
      ) : null}
    </div>
  );
}
