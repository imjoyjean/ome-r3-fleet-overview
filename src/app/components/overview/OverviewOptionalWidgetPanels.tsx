import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Badge, SmallText, StatusDot, TinyText } from "../../../imports/UIComponents";
import {
  ACTIVE_INCIDENTS,
  FLEET_CAPACITY_ROWS,
  FLEET_HEALTH_BY_GROUP,
  MTTR_TREND,
  overviewCopy,
  SLO_ERROR_BUDGETS,
  VERSION_DISTRIBUTION,
} from "./fleetOverviewDemoData";

function DonutRing({
  percent,
  color,
  size = 72,
}: {
  percent: number;
  color: string;
  size?: number;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg width={size} height={size} className="shrink-0" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function FleetCapacityWidgetPanel() {
  return (
    <>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {FLEET_CAPACITY_ROWS.map((row) => (
          <Link
            key={row.id}
            to={row.href}
            className="rounded-md border px-3 py-3 transition-colors hover:bg-muted/30"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <TinyText style={{ fontWeight: "var(--font-weight-medium)" }}>
                {row.label}
              </TinyText>
              <Badge variant={row.hot ? "warning" : "default"}>{row.value}</Badge>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${row.percent}%`,
                  backgroundColor: row.hot ? "var(--chart-4)" : "var(--primary)",
                }}
              />
            </div>
            <TinyText muted className="!mt-1.5 !block">
              {row.detail}
            </TinyText>
          </Link>
        ))}
      </div>
      <div className="px-4 pb-4">
        <Link
          to="/observability"
          className="inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          {overviewCopy.viewInObservability}
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </>
  );
}

export function VersionDistributionWidgetPanel() {
  const total = VERSION_DISTRIBUTION.reduce((sum, row) => sum + row.count, 0);

  return (
    <div className="p-4">
      <TinyText muted className="!mb-3 !block">
        {total} clusters · target OCP 4.16.2
      </TinyText>
      <div className="space-y-3">
        {VERSION_DISTRIBUTION.map((row) => (
          <div key={row.version}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
                {row.version}
              </SmallText>
              <TinyText muted>
                {row.count} clusters
              </TinyText>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.count / total) * 100}%`,
                  backgroundColor: row.behind ? "var(--chart-4)" : "#3E8635",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/fleetrollout"
        className="mt-4 inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
        style={{ color: "var(--primary)" }}
      >
        Plan upgrade rollout
        <ChevronRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

export function FleetHealthByGroupWidgetPanel() {
  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {FLEET_HEALTH_BY_GROUP.map((group) => (
        <Link
          key={group.id}
          to={group.href}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/20"
        >
          <StatusDot
            status={
              group.status === "healthy"
                ? "success"
                : group.status === "warning"
                  ? "warning"
                  : "error"
            }
          />
          <div className="min-w-0 flex-1">
            <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
              {group.name}
            </SmallText>
            <TinyText muted className="!block">
              {group.clusterCount} clusters · {group.summary}
            </TinyText>
          </div>
          <TinyText muted className="shrink-0">
            {group.healthLabel}
          </TinyText>
        </Link>
      ))}
    </div>
  );
}

export function ActiveIncidentsWidgetPanel() {
  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {ACTIVE_INCIDENTS.map((incident) => (
        <Link
          key={incident.id}
          to={incident.href}
          className="block px-4 py-3 transition-colors hover:bg-muted/20"
        >
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
              {incident.id}
            </SmallText>
            <Badge variant={incident.severity === "warning" ? "warning" : "info"}>
              {incident.badge}
            </Badge>
          </div>
          <SmallText className="!mb-1 !block">{incident.title}</SmallText>
          {incident.tags?.map((tag) => (
            <TinyText
              key={tag}
              muted
              className="!mr-2 !inline-block rounded px-1.5 py-0.5"
              style={{ backgroundColor: "var(--muted)" }}
            >
              {tag}
            </TinyText>
          ))}
        </Link>
      ))}
      <div className="px-4 py-3">
        <Link
          to="/observability"
          className="inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          Open observability
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

export function SloErrorBudgetsWidgetPanel() {
  return (
    <>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {SLO_ERROR_BUDGETS.map((slo) => (
          <div
            key={slo.id}
            className="flex items-center gap-4 rounded-md border px-3 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <DonutRing percent={slo.remainingPercent} color="#3E8635" />
            <div className="min-w-0">
              <SmallText
                className="!mb-0.5 !block"
                style={{ fontWeight: "var(--font-weight-medium)" }}
              >
                {slo.remainingPercent}% remaining
              </SmallText>
              <TinyText muted className="!block leading-snug">
                {slo.pipeline}
              </TinyText>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <Link
          to="/observability"
          className="inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          {overviewCopy.viewInObservability}
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </>
  );
}

export function MttrWidgetPanel() {
  const maxMinutes = Math.max(...MTTR_TREND.map((point) => point.minutes));
  const minMinutes = Math.min(...MTTR_TREND.map((point) => point.minutes));
  const range = maxMinutes - minMinutes || 1;
  const chartHeight = 120;
  const chartWidth = 280;
  const step = chartWidth / (MTTR_TREND.length - 1);

  const points = MTTR_TREND.map((point, index) => {
    const x = index * step;
    const y =
      chartHeight -
      ((point.minutes - minMinutes) / range) * (chartHeight - 16) -
      8;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="p-4">
      <TinyText muted className="!mb-3 !block">
        Rolling 6 months · prototype metrics from observability
      </TinyText>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="mb-3 w-full max-w-md"
        aria-hidden
      >
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          points={points}
        />
      </svg>
      <div className="flex justify-between gap-2">
        {MTTR_TREND.map((point) => (
          <TinyText key={point.month} muted>
            {point.month}
          </TinyText>
        ))}
      </div>
      <Link
        to="/observability"
        className="mt-4 inline-flex items-center gap-0.5 text-sm font-medium hover:underline"
        style={{ color: "var(--primary)" }}
      >
        View in observability
        <ChevronRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}
