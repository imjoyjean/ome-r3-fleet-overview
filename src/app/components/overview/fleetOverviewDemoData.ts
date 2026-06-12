import {
  FLEET_ROLLOUT_DEMO_ACTIVITIES,
  getFleetRolloutDetail,
  type FleetRolloutActivity,
} from "../deployments/fleetRolloutDemoData";

export type AttentionSeverity = "critical" | "warning" | "info";

export type AttentionItem = {
  id: string;
  severity: AttentionSeverity;
  title: string;
  description: string;
  href: string;
  hrefLabel: string;
};

export type FleetHealthSignal = {
  id: string;
  label: string;
  summary: string;
  status: "healthy" | "warning" | "critical" | "neutral";
  href: string;
  detail?: string;
};

export type DetectedRecommendation = {
  id: string;
  title: string;
  description: string;
  scope: string;
  href: string;
  hrefLabel: string;
  kind: "upgrade" | "drift" | "cert" | "compliance";
};

export type OverviewWidget = {
  id: string;
  title: string;
  metric: string;
  detail: string;
  href: string;
  trend?: string;
  /** Where the pin was created, e.g. a saved cluster search */
  sourceLabel?: string;
};

export const overviewCopy = {
  pageTitle: "Overview",
  pageSubtitle:
    "Fleet health, active rollouts, and exceptions · details live in Observability and Fleet rollout",
  lastUpdated: "Updated 2 minutes ago",
  attentionTitle: "Needs your action",
  fleetRollouts: "Fleet rollouts",
  rolloutsInProgress: "In progress",
  lastCompletedRollout: "Last completed rollout",
  morningAfterHint: "Morning-after confidence check",
  activeRollouts: "Active rollouts",
  fleetHealth: "Platform health",
  recommendations: "Suggested next steps",
  yourView: "Your view",
  yourViewDescription:
    "Personalize this view by pinning saved searches and shortcuts from other pages.",
  viewAllRollouts: "View all rollouts",
  viewAllRolloutsCount: (n: number) => `View all rollouts (${n})`,
  rolloutsShowing: (shown: number, total: number) => `Showing ${shown} of ${total}`,
  showAll: (n: number) => `Show all (${n})`,
  showLess: "Show less",
  viewInObservability: "View in observability",
  openObservability: "Open observability",
  viewClusters: "View clusters",
};

/** R1 optional widgets — summary snapshots with link-out to Observability / fleet tools */
export type FleetCapacityRow = {
  id: string;
  label: string;
  value: string;
  percent: number;
  hot?: boolean;
  detail: string;
  href: string;
};

export type VersionDistributionRow = {
  version: string;
  count: number;
  behind?: boolean;
};

export type FleetHealthGroup = {
  id: string;
  name: string;
  clusterCount: number;
  summary: string;
  healthLabel: string;
  status: "healthy" | "warning" | "critical";
  href: string;
};

export type ActiveIncident = {
  id: string;
  title: string;
  badge: string;
  severity: "warning" | "info";
  tags?: string[];
  href: string;
};

export type SloErrorBudget = {
  id: string;
  remainingPercent: number;
  pipeline: string;
};

export type MttrTrendPoint = {
  month: string;
  minutes: number;
};

export const FLEET_CAPACITY_ROWS: FleetCapacityRow[] = [
  {
    id: "cpu",
    label: "CPU utilization (fleet avg)",
    value: "72%",
    percent: 72,
    detail: "8 clusters above 85%",
    href: "/observability",
  },
  {
    id: "memory",
    label: "Memory utilization (fleet avg)",
    value: "68%",
    percent: 68,
    detail: "3 clusters above 90%",
    href: "/observability",
  },
  {
    id: "storage",
    label: "Storage pressure",
    value: "54%",
    percent: 54,
    detail: "2 clusters near quota",
    href: "/observability",
  },
  {
    id: "hot-clusters",
    label: "Clusters under pressure",
    value: "8",
    percent: 20,
    hot: true,
    detail: "prod-eu-02, prod-us-04, staging-ap-01…",
    href: "/observability",
  },
];

export const VERSION_DISTRIBUTION: VersionDistributionRow[] = [
  { version: "OCP 4.16.2 (target)", count: 35 },
  { version: "OCP 4.16.1", count: 3, behind: true },
  { version: "OCP 4.15.8", count: 2, behind: true },
];

export const FLEET_HEALTH_BY_GROUP: FleetHealthGroup[] = [
  {
    id: "prod",
    name: "Production",
    clusterCount: 18,
    summary: "1 rollout blocked · 2 degraded",
    healthLabel: "Needs attention",
    status: "warning",
    href: "/clusters",
  },
  {
    id: "staging",
    name: "Staging",
    clusterCount: 12,
    summary: "All operators available",
    healthLabel: "Healthy",
    status: "healthy",
    href: "/clusters",
  },
  {
    id: "dev",
    name: "Development",
    clusterCount: 10,
    summary: "GitOps sync lag on 1 application",
    healthLabel: "Monitor",
    status: "warning",
    href: "/clusters",
  },
];

export const ACTIVE_INCIDENTS: ActiveIncident[] = [
  {
    id: "INC-1042",
    title: "Elevated API latency on prod-eu-02",
    badge: "Critical",
    severity: "warning",
    tags: ["prod-eu-02", "apiserver"],
    href: "/observability",
  },
  {
    id: "INC-1039",
    title: "etcd leader election flapping on staging-us-01",
    badge: "Warning",
    severity: "warning",
    tags: ["staging-us-01", "etcd"],
    href: "/observability",
  },
];

export const SLO_ERROR_BUDGETS: SloErrorBudget[] = [
  {
    id: "slo-api",
    remainingPercent: 82,
    pipeline: "API availability · 99.9% SLO",
  },
  {
    id: "slo-ingress",
    remainingPercent: 64,
    pipeline: "Ingress success rate · prod fleet",
  },
];

export const MTTR_TREND: MttrTrendPoint[] = [
  { month: "Jan", minutes: 48 },
  { month: "Feb", minutes: 42 },
  { month: "Mar", minutes: 38 },
  { month: "Apr", minutes: 35 },
  { month: "May", minutes: 31 },
  { month: "Jun", minutes: 28 },
];

export function summarizeRolloutProgress(activity: FleetRolloutActivity): string {
  if (activity.progressType === "simple" && activity.simpleProgress) {
    const { current, total, unit } = activity.simpleProgress;
    return `${current}/${total} ${unit}`;
  }
  if (activity.canaryProgress) {
    const cp = activity.canaryProgress;
    if (cp.p1.status === "active") {
      return `Canary ${cp.p1.current}/${cp.p1.total}`;
    }
    if (cp.p1.status === "failed") {
      return `Canary failed ${cp.p1.failedCount ?? 0}/${cp.p1.total}`;
    }
    if (cp.p2.status === "active") {
      return `Wave 2 ${cp.p2.current}/${cp.p2.total}`;
    }
    if (activity.status === "waiting") {
      return "Scheduled";
    }
    return `Canary ${cp.p1.current}/${cp.p1.total}`;
  }
  return activity.note ?? "—";
}

export function rolloutStatusLabel(activity: FleetRolloutActivity): string {
  switch (activity.status) {
    case "running":
      return "In progress";
    case "stopped":
      return "Failed";
    case "waiting":
      return "Scheduled";
    case "soaking":
      return "Soaking";
    case "completed":
      return "Complete";
    case "active":
      return "Active";
    default:
      return activity.status;
  }
}

export function rolloutStatusVariant(
  activity: FleetRolloutActivity,
): "success" | "warning" | "destructive" | "info" | "default" {
  if (activity.status === "stopped") return "destructive";
  if (activity.status === "waiting") return "default";
  if (activity.status === "running" || activity.status === "active") return "info";
  if (activity.status === "completed") return "success";
  return "warning";
}

export function getActiveFleetChanges(): FleetRolloutActivity[] {
  return FLEET_ROLLOUT_DEMO_ACTIVITIES.filter(
    (a) => !a.archived && a.status !== "completed",
  ).sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

export const ACTIVE_ROLLOUT_PREVIEW_COUNT = 5;

function rolloutOverviewPriority(status: FleetRolloutActivity["status"]): number {
  switch (status) {
    case "stopped":
      return 0;
    case "running":
    case "active":
    case "soaking":
      return 1;
    case "waiting":
      return 2;
    default:
      return 3;
  }
}

/** Overview table — failed first, then active, then scheduled; capped with link to full list. */
export function getOverviewActiveRollouts(limit = ACTIVE_ROLLOUT_PREVIEW_COUNT) {
  const all = getActiveFleetChanges().sort((a, b) => {
    const priorityDiff =
      rolloutOverviewPriority(a.status) - rolloutOverviewPriority(b.status);
    if (priorityDiff !== 0) return priorityDiff;
    return b.updatedAtMs - a.updatedAtMs;
  });
  const preview = all.slice(0, limit);
  return {
    all,
    preview,
    hiddenCount: Math.max(0, all.length - preview.length),
  };
}

/** Morning KPI strip — Journey 3: alerts, capacity, compliance via fleet health */
export type FleetSummaryStat = {
  id: string;
  label: string;
  value: string;
  status: string;
  href: string;
  trend?: string;
};

export const FLEET_SUMMARY_STATS: FleetSummaryStat[] = [
  {
    id: "clusters",
    label: "Clusters",
    value: "40",
    status: "2 degraded",
    href: "/clusters",
  },
  {
    id: "rollouts",
    label: "Active rollouts",
    value: "10",
    status: "1 failed",
    href: "/fleetrollout",
  },
  {
    id: "capacity",
    label: "Capacity (CPU avg)",
    value: "72%",
    status: "8 clusters above 85%",
    trend: "+4% vs last week",
    href: "/observability",
  },
  {
    id: "alerts",
    label: "Critical alerts",
    value: "3",
    status: "12 warnings · 2 new today",
    href: "/observability",
  },
  {
    id: "versions",
    label: "Version target",
    value: "5 behind",
    status: "Target OCP 4.16.2",
    href: "/fleetrollout",
  },
];

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "att-action-required",
    severity: "warning",
    title: "Approval required",
    description: "OCP 4.17 → 4.18 on env=prod waiting before maintenance window",
    href: "/settings",
    hrefLabel: "Approve",
  },
  {
    id: "att-alert",
    severity: "critical",
    title: "Critical alert · API latency",
    description: "prod-eu-02 apiserver · 3 critical alerts fleet-wide",
    href: "/observability",
    hrefLabel: "Investigate",
  },
  {
    id: "att-operators",
    severity: "warning",
    title: "Operator unavailable",
    description: "Cluster Version or Ingress degraded on 3 clusters",
    href: "/clusters",
    hrefLabel: "View clusters",
  },
];

/** Secondary signals — aggregate health not repeated in Attention or Recommendations */
export const FLEET_HEALTH_SIGNALS: FleetHealthSignal[] = [
  {
    id: "gitops",
    label: "GitOps sync",
    summary: "38/40 synced",
    status: "warning",
    href: "/fleetrollout/argocd-app-rollout-005",
    detail: "2 applications out of sync",
  },
  {
    id: "operators",
    label: "Operators",
    summary: "37/40 available",
    status: "warning",
    href: "/clusters",
    detail: "Cluster Version, Ingress",
  },
  {
    id: "policy",
    label: "Compliance",
    summary: "35/40 compliant",
    status: "warning",
    href: "/policies",
    detail: "5 open violations",
  },
];

export const DETECTED_RECOMMENDATIONS: DetectedRecommendation[] = [
  {
    id: "rec-zstream",
    title: "OpenShift 4.16.2 available",
    description: "Patch release CVE-2026-1188 · 40 clusters in prod-cluster-set",
    scope: "40 clusters",
    href: "/fleetrollout",
    hrefLabel: "Plan rollout",
    kind: "upgrade",
  },
  {
    id: "rec-drift",
    title: "MachineConfig drift",
    description: "3 clusters differ from fleet-gitops baseline worker-v2",
    scope: "3 clusters",
    href: "/fleetrollout/git-mc-rollout-007",
    hrefLabel: "View status",
    kind: "drift",
  },
];

/** User-pinned cards — typically saved searches promoted from list pages */
export const PINNED_WIDGETS: OverviewWidget[] = [
  {
    id: "security-prod-cves",
    title: "Prod critical CVEs",
    sourceLabel: "Saved search · Security",
    metric: "2 critical CVEs",
    detail: "Images in prod across 3 clusters",
    href: "/security",
    trend: "−1 since yesterday",
  },
  {
    id: "vms-migration-queue",
    title: "VM migration queue",
    sourceLabel: "Saved search · Virtual machines",
    metric: "412 running",
    detail: "6 migration jobs in progress",
    href: "/virtual-machines",
  },
];

export const DEFAULT_YOUR_VIEW_CARD_IDS = PINNED_WIDGETS.map((widget) => widget.id);

export function getMorningAfterSummary() {
  const detail = getFleetRolloutDetail("fleet-patch-004");
  return detail?.completedSummary ?? null;
}

export function getMorningAfterDetail() {
  return getFleetRolloutDetail("fleet-patch-004");
}
