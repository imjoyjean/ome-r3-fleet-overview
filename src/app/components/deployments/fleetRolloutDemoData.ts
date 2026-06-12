import type { DeploymentResourceCategory } from "./deploymentTabPresets";

export type RolloutRunChannel =
  | "console"
  | "git"
  | "argocd"
  | "aap"
  | "governance";

export type FleetRolloutSourceFilter =
  | "all"
  | "console"
  | "git"
  | "argocd"
  | "aap";

export type FleetRolloutActivityStatus =
  | "stopped"
  | "running"
  | "soaking"
  | "active"
  | "completed"
  | "waiting";

export type FleetRolloutExternalRef = {
  system: string;
  label: string;
  href?: string;
};

export type FleetRolloutActivity = {
  id: string;
  action: string;
  status: FleetRolloutActivityStatus;
  statusColor: string;
  resource: string;
  actionTargets?: string;
  progressType: "canary" | "simple";
  canaryProgress?: {
    p1: {
      current: number;
      total: number;
      status: "complete" | "failed" | "pending" | "active";
      failedCount?: number;
    };
    soak: {
      status: "active" | "pending" | "complete" | "cancelled";
      remaining?: string;
    };
    p2: {
      current: number;
      total: number;
      status: "active" | "pending" | "complete" | "cancelled";
    };
  };
  simpleProgress?: {
    current: number;
    total: number;
    unit: string;
  };
  note?: string;
  created: string;
  drilldownAvailable?: boolean;
  labels?: string[];
  resourceCategory: DeploymentResourceCategory;
  archived?: boolean;
  updatedAtMs: number;
  runChannel: RolloutRunChannel;
  externalRef?: FleetRolloutExternalRef;
};

export type FleetRolloutDetailKind = "failed" | "completed" | "in_progress";

export type FleetRolloutFailedPhase = {
  start: Date;
  end: Date;
  status: string;
  successCount?: number;
  failedCount?: number;
  totalCount: number;
  failureRate?: number;
  failedClusters?: { name: string; reason: string }[];
  successfulClusters?: string[];
};

export type FleetRolloutDetail = {
  kind: FleetRolloutDetailKind;
  id: string;
  action: string;
  actionTargets: string;
  runChannel: RolloutRunChannel;
  startedByLabel: string;
  externalRef?: FleetRolloutExternalRef;
  openExternalLabel?: string;
  admin: string;
  created: Date;
  startTime: Date;
  endTime?: Date;
  affectedClusters: number;
  selector: string;
  status: string;
  statusColor: string;
  /** Failed canary drilldown only */
  safetyBrakeTime?: Date;
  phase1?: FleetRolloutFailedPhase;
  soak?: { start: Date; end: Date; status: string };
  phase2?: FleetRolloutFailedPhase;
  maintenanceWindow?: { start: Date; end: Date };
  /** Completed summary */
  completedSummary?: {
    durationLabel: string;
    verifiedAtLabel: string;
    morningAfterHeadline: string;
    auditRef?: string;
  };
  /** In-progress external rollout */
  progressSummary?: string;
  /** Rollout status freshness — sync for external channels, last updated for console */
  freshness: FleetRolloutStatusFreshness;
};

export type FleetRolloutStatusFreshness = {
  /** e.g. "Last synced from Argo CD" or "Last updated" */
  caption: string;
  /** e.g. "3m ago" — updated to "Just now" after refresh in prototype */
  relativeTime: string;
  /** Channel-specific refresh control label */
  refreshLabel: string;
};

const RUN_CHANNEL_LABELS: Record<RolloutRunChannel, string> = {
  console: "Console",
  git: "Git",
  argocd: "Argo CD",
  aap: "AAP",
  governance: "Governance",
};

export function runChannelLabel(channel: RolloutRunChannel): string {
  return RUN_CHANNEL_LABELS[channel];
}

export function matchesRunChannelFilter(
  activity: FleetRolloutActivity,
  filter: FleetRolloutSourceFilter,
): boolean {
  if (filter === "all") return true;
  return activity.runChannel === filter;
}

export const FLEET_ROLLOUT_DEMO_ACTIVITIES: FleetRolloutActivity[] = [
  {
    id: "fleet-upgrade-001",
    action: "OpenShift cluster update",
    status: "stopped",
    statusColor: "#C9190B",
    resource: "label:canary (40)",
    actionTargets: "OCP 4.16 → 4.17",
    progressType: "canary",
    canaryProgress: {
      p1: {
        current: 10,
        total: 10,
        status: "failed",
        failedCount: 6,
      },
      soak: { status: "cancelled" },
      p2: { current: 0, total: 30, status: "cancelled" },
    },
    note: "Ingress timeout",
    created: "Mar 26, 2026 22:00",
    drilldownAvailable: true,
    labels: ["label:canary", "OpenShift cluster update", "Failed"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-26T22:00:00"),
    runChannel: "console",
  },
  {
    id: "fleet-upgrade-console-waiting",
    action: "OpenShift cluster update",
    status: "waiting",
    statusColor: "#3E8635",
    resource: "env=prod (40)",
    actionTargets: "OCP 4.17 → 4.18",
    progressType: "canary",
    canaryProgress: {
      p1: { current: 0, total: 10, status: "pending" },
      soak: { status: "pending" },
      p2: { current: 0, total: 30, status: "pending" },
    },
    note: "Waiting on scheduled execution window",
    created: "Mar 27, 2026 10:15",
    drilldownAvailable: false,
    labels: ["env=prod", "OpenShift cluster update"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T10:15:00"),
    runChannel: "console",
  },
  {
    id: "argocd-app-rollout-005",
    action: "Argo CD application sync",
    status: "running",
    statusColor: "#3E8635",
    resource: "app=storefront (8)",
    actionTargets: "chart 2.4.1 → 2.5.0",
    progressType: "simple",
    simpleProgress: {
      current: 5,
      total: 8,
      unit: "synced",
    },
    created: "Mar 27, 2026 09:00",
    labels: ["app=storefront", "Argo CD"],
    resourceCategory: "application",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T09:00:00"),
    runChannel: "argocd",
    externalRef: {
      system: "Argo CD",
      label: "Application: storefront-prod",
      href: "https://argocd.example.com/applications/storefront-prod",
    },
    drilldownAvailable: true,
  },
  {
    id: "git-mc-rollout-007",
    action: "Platform baseline sync",
    status: "running",
    statusColor: "#3E8635",
    resource: "region=na (24)",
    actionTargets: "MachineConfig pool worker-v2",
    progressType: "simple",
    simpleProgress: {
      current: 14,
      total: 24,
      unit: "clusters reconciled",
    },
    note: "Merge fleet-gitops#842",
    created: "Mar 27, 2026 07:30",
    labels: ["region=na", "Platform baseline"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T07:30:00"),
    runChannel: "git",
    externalRef: {
      system: "Git",
      label: "main @ 9aa12ff (PR #842 merged)",
      href: "https://github.com/example/fleet-gitops/commit/9aa12ff",
    },
    drilldownAvailable: true,
  },
  {
    id: "aap-cve-patch-008",
    action: "Fleet CVE remediation",
    status: "running",
    statusColor: "#3E8635",
    resource: "env=prod (32)",
    actionTargets: "CVE-2026-1234 fix",
    progressType: "simple",
    simpleProgress: {
      current: 18,
      total: 32,
      unit: "hosts patched",
    },
    created: "Mar 27, 2026 06:00",
    labels: ["env=prod", "CVE patch"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T06:00:00"),
    runChannel: "aap",
    externalRef: {
      system: "Ansible Automation Platform",
      label: "Job #5847 · ocp-node-patch",
      href: "https://aap.example.com/#/jobs/playbook/5847",
    },
    drilldownAvailable: true,
  },
  {
    id: "git-operator-rollout-009",
    action: "Operator catalog sync",
    status: "running",
    statusColor: "#3E8635",
    resource: "channel=stable (12)",
    actionTargets: "Cluster Version 4.16.2",
    progressType: "simple",
    simpleProgress: {
      current: 7,
      total: 12,
      unit: "clusters updated",
    },
    created: "Mar 27, 2026 11:20",
    labels: ["channel=stable", "Operator update"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T11:20:00"),
    runChannel: "git",
    externalRef: {
      system: "Git",
      label: "catalog/stable @ f3c91ab",
      href: "https://github.com/example/fleet-gitops/tree/catalog/stable",
    },
    drilldownAvailable: true,
  },
  {
    id: "argocd-config-rollout-010",
    action: "Argo CD application sync",
    status: "soaking",
    statusColor: "#3E8635",
    resource: "app=payments (6)",
    actionTargets: "Helm values prod-v3",
    progressType: "simple",
    simpleProgress: {
      current: 6,
      total: 6,
      unit: "synced",
    },
    note: "24h soak after wave 1",
    created: "Mar 26, 2026 18:00",
    labels: ["app=payments", "Argo CD"],
    resourceCategory: "application",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T08:45:00"),
    runChannel: "argocd",
    externalRef: {
      system: "Argo CD",
      label: "Application: payments-prod",
      href: "https://argocd.example.com/applications/payments-prod",
    },
    drilldownAvailable: true,
  },
  {
    id: "aap-mc-rollout-011",
    action: "MachineConfig rollout",
    status: "running",
    statusColor: "#3E8635",
    resource: "env=stage (18)",
    actionTargets: "worker pool hardening-v4",
    progressType: "simple",
    simpleProgress: {
      current: 9,
      total: 18,
      unit: "nodes updated",
    },
    created: "Mar 27, 2026 05:30",
    labels: ["env=stage", "MachineConfig"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T05:30:00"),
    runChannel: "aap",
    externalRef: {
      system: "Ansible Automation Platform",
      label: "Job #5901 · mc-worker-hardening",
      href: "https://aap.example.com/#/jobs/playbook/5901",
    },
    drilldownAvailable: true,
  },
  {
    id: "console-label-rollout-012",
    action: "Cluster label update",
    status: "active",
    statusColor: "#3E8635",
    resource: "fleet=edge (15)",
    actionTargets: "maintenance-window=2026-Q2",
    progressType: "simple",
    simpleProgress: {
      current: 11,
      total: 15,
      unit: "clusters labeled",
    },
    created: "Mar 27, 2026 12:00",
    labels: ["fleet=edge", "Label update"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T12:00:00"),
    runChannel: "console",
    drilldownAvailable: false,
  },
  {
    id: "git-ingress-rollout-013",
    action: "Ingress controller sync",
    status: "waiting",
    statusColor: "#3E8635",
    resource: "region=eu (22)",
    actionTargets: "ingress v2.12.1",
    progressType: "simple",
    simpleProgress: {
      current: 0,
      total: 22,
      unit: "clusters",
    },
    note: "Scheduled for Mar 28 maintenance window",
    created: "Mar 27, 2026 13:10",
    labels: ["region=eu", "Ingress"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.parse("2026-03-27T13:10:00"),
    runChannel: "git",
    externalRef: {
      system: "Git",
      label: "ingress/overlays/prod @ d8e22c1",
      href: "https://github.com/example/fleet-gitops/commit/d8e22c1",
    },
    drilldownAvailable: true,
  },
  {
    id: "fleet-patch-004",
    action: "Fleet CVE remediation",
    status: "completed",
    statusColor: "#3E8635",
    resource: "env=prod (100)",
    actionTargets: "CVE-2026-1188 fix",
    progressType: "simple",
    simpleProgress: { current: 100, total: 100, unit: "done" },
    created: "Mar 24, 2026 20:00",
    labels: ["env=prod", "CVE patch"],
    resourceCategory: "cluster",
    archived: true,
    updatedAtMs: Date.parse("2026-03-24T20:00:00"),
    runChannel: "aap",
    externalRef: {
      system: "Ansible Automation Platform",
      label: "Job #5712 · ocp-node-patch",
      href: "https://aap.example.com/#/jobs/playbook/5712",
    },
    drilldownAvailable: true,
  },
];

const FLEET_ROLLOUT_DETAILS: Record<string, FleetRolloutDetail> = {
  "fleet-upgrade-001": {
    kind: "failed",
    id: "fleet-upgrade-001",
    action: "OpenShift cluster update",
    actionTargets: "OCP 4.16 → 4.17",
    runChannel: "console",
    startedByLabel: "Console wizard",
    admin: "user-01",
    created: new Date("2026-03-24T22:00:00Z"),
    startTime: new Date("2026-03-24T22:00:00Z"),
    endTime: new Date("2026-03-26T18:00:00Z"),
    affectedClusters: 40,
    selector: "label:canary, env=prod",
    status: "Stopped by error threshold",
    statusColor: "#C9190B",
    safetyBrakeTime: new Date("2026-03-25T00:20:00Z"),
    phase1: {
      start: new Date("2026-03-24T22:05:00Z"),
      end: new Date("2026-03-25T00:20:00Z"),
      status: "failed",
      successCount: 4,
      failedCount: 6,
      totalCount: 10,
      failureRate: 60,
      failedClusters: [
        { name: "cnfdf19", reason: "Ingress timeout" },
        { name: "cnfdf07", reason: "Connection refused" },
        { name: "cnfdf23", reason: "Pod CrashLoopBackOff" },
        { name: "cnfdf31", reason: "Ingress timeout" },
        { name: "cnfdf42", reason: "Ingress timeout" },
        { name: "cnfdf56", reason: "Network policy conflict" },
      ],
      successfulClusters: ["cnfdf12", "cnfdf28", "cnfdf33", "cnfdf45"],
    },
    soak: {
      start: new Date("2026-03-25T00:20:00Z"),
      end: new Date("2026-03-26T00:20:00Z"),
      status: "cancelled",
    },
    phase2: {
      start: new Date("2026-03-26T00:20:00Z"),
      end: new Date("2026-03-26T18:00:00Z"),
      status: "cancelled",
      successCount: 0,
      totalCount: 30,
    },
    maintenanceWindow: {
      start: new Date("2026-03-24T22:00:00Z"),
      end: new Date("2026-03-27T02:00:00Z"),
    },
    freshness: {
      caption: "Last updated",
      relativeTime: "1m ago",
      refreshLabel: "Refresh status",
    },
  },
  "fleet-patch-004": {
    kind: "completed",
    id: "fleet-patch-004",
    action: "Fleet CVE remediation",
    actionTargets: "CVE-2026-1188 fix",
    runChannel: "aap",
    startedByLabel: "Ansible Automation Platform",
    externalRef: {
      system: "Ansible Automation Platform",
      label: "Job #5712 · ocp-node-patch",
      href: "https://aap.example.com/#/jobs/playbook/5712",
    },
    openExternalLabel: "Open in Ansible Automation Platform",
    admin: "automation-svc",
    created: new Date("2026-03-24T18:00:00Z"),
    startTime: new Date("2026-03-24T18:05:00Z"),
    endTime: new Date("2026-03-24T20:00:00Z"),
    affectedClusters: 100,
    selector: "env=prod",
    status: "Complete",
    statusColor: "#3E8635",
    completedSummary: {
      durationLabel: "1h 55m",
      verifiedAtLabel: "Last verified Mar 25, 2026 at 06:00",
      morningAfterHeadline:
        "100 clusters patched; no open failures; last AAP job succeeded.",
      auditRef: "CHG-48291",
    },
    freshness: {
      caption: "Last synced from Ansible Automation Platform",
      relativeTime: "12m ago",
      refreshLabel: "Refresh job status",
    },
  },
  "argocd-app-rollout-005": {
    kind: "in_progress",
    id: "argocd-app-rollout-005",
    action: "Argo CD application sync",
    actionTargets: "chart 2.4.1 → 2.5.0",
    runChannel: "argocd",
    startedByLabel: "Argo CD",
    externalRef: {
      system: "Argo CD",
      label: "Application: storefront-prod",
      href: "https://argocd.example.com/applications/storefront-prod",
    },
    openExternalLabel: "Open in Argo CD",
    admin: "gitops-controller",
    created: new Date("2026-03-27T09:00:00Z"),
    startTime: new Date("2026-03-27T09:00:00Z"),
    affectedClusters: 8,
    selector: "app=storefront",
    status: "Sync in progress",
    statusColor: "#0066CC",
    progressSummary: "5/8 clusters synced · wave 2 running",
    freshness: {
      caption: "Last synced from Argo CD",
      relativeTime: "3m ago",
      refreshLabel: "Refresh from Argo CD",
    },
  },
  "git-mc-rollout-007": {
    kind: "in_progress",
    id: "git-mc-rollout-007",
    action: "Platform baseline sync",
    actionTargets: "MachineConfig pool worker-v2",
    runChannel: "git",
    startedByLabel: "Git (fleet-gitops)",
    externalRef: {
      system: "Git",
      label: "main @ 9aa12ff (PR #842 merged)",
      href: "https://github.com/example/fleet-gitops/commit/9aa12ff",
    },
    openExternalLabel: "View in Git",
    admin: "platform-gitops",
    created: new Date("2026-03-27T07:30:00Z"),
    startTime: new Date("2026-03-27T07:30:00Z"),
    affectedClusters: 24,
    selector: "region=na",
    status: "Reconciling",
    statusColor: "#0066CC",
    progressSummary: "14/24 clusters reconciled",
    freshness: {
      caption: "Last synced from Git",
      relativeTime: "5m ago",
      refreshLabel: "Refresh reconcile status",
    },
  },
  "aap-cve-patch-008": {
    kind: "in_progress",
    id: "aap-cve-patch-008",
    action: "Fleet CVE remediation",
    actionTargets: "CVE-2026-1234 fix",
    runChannel: "aap",
    startedByLabel: "Ansible Automation Platform",
    externalRef: {
      system: "Ansible Automation Platform",
      label: "Job #5847 · ocp-node-patch",
      href: "https://aap.example.com/#/jobs/playbook/5847",
    },
    openExternalLabel: "Open in Ansible Automation Platform",
    admin: "automation-svc",
    created: new Date("2026-03-27T06:00:00Z"),
    startTime: new Date("2026-03-27T06:00:00Z"),
    affectedClusters: 32,
    selector: "env=prod",
    status: "Running",
    statusColor: "#0066CC",
    progressSummary: "18/32 hosts patched",
    freshness: {
      caption: "Last synced from Ansible Automation Platform",
      relativeTime: "1m ago",
      refreshLabel: "Refresh job status",
    },
  },
};

export function getFleetRolloutActivity(
  id: string,
): FleetRolloutActivity | undefined {
  return FLEET_ROLLOUT_DEMO_ACTIVITIES.find((a) => a.id === id);
}

export function getFleetRolloutDetail(
  id: string,
): FleetRolloutDetail | undefined {
  return FLEET_ROLLOUT_DETAILS[id];
}

export function buildWizardCreatedActivity(
  executionPolicy?: { runAs: string } | null,
): FleetRolloutActivity {
  return {
    id: "fleet-upgrade-new",
    action: "OpenShift cluster update",
    status: "waiting",
    statusColor: "#3E8635",
    resource: "env=prod (40)",
    actionTargets: "OCP 4.17 → 4.18",
    progressType: "canary",
    canaryProgress: {
      p1: { current: 0, total: 10, status: "pending" },
      soak: { status: "pending" },
      p2: { current: 0, total: 30, status: "pending" },
    },
    note: executionPolicy
      ? `Waiting on scheduled execution window · Run as ${executionPolicy.runAs}`
      : "Waiting on scheduled execution window",
    created: "Mar 27, 2026 10:15",
    drilldownAvailable: false,
    labels: ["env=prod", "OpenShift cluster update"],
    resourceCategory: "cluster",
    archived: false,
    updatedAtMs: Date.now(),
    runChannel: "console",
  };
}
