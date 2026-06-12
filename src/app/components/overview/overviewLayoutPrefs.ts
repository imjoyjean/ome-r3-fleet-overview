import { DEFAULT_YOUR_VIEW_CARD_IDS } from "./fleetOverviewDemoData";

export type OverviewSectionId =
  | "getting-started"
  | "fleet-summary"
  | "attention"
  | "fleet-rollouts"
  | "recommendations"
  | "pinned-insights"
  | "capacity-chart"
  | "version-distribution"
  | "health-by-group"
  | "active-incidents"
  | "slo-error-budgets"
  | "mttr-trend";

export type OverviewWidgetHeight = "default" | "minimized" | "maximized";

export type OverviewSectionLayout = {
  id: OverviewSectionId;
  visible: boolean;
  locked?: boolean;
  height?: OverviewWidgetHeight;
};

export type OverviewLayoutPrefs = {
  sections: OverviewSectionLayout[];
  /** User-defined order of pin card ids in Your view */
  yourViewCardOrder?: string[];
};

export const OVERVIEW_SECTION_META: Record<
  OverviewSectionId,
  { label: string; description: string }
> = {
  "getting-started": {
    label: "Getting started",
    description: "Onboarding checklist for new console users",
  },
  "fleet-summary": {
    label: "Fleet at a glance",
    description: "Headline KPIs and platform health summary",
  },
  attention: {
    label: "Needs your action",
    description: "Exceptions that need a decision or investigation now",
  },
  "fleet-rollouts": {
    label: "Fleet rollouts",
    description: "Last completed rollout and in-progress changes",
  },
  recommendations: {
    label: "Recommendations",
    description: "Detected upgrades and configuration drift",
  },
  "pinned-insights": {
    label: "Your view",
    description: "Pin saved searches and shortcuts to personalize this view",
  },
  "capacity-chart": {
    label: "Capacity utilization",
    description: "Fleet CPU, memory, and storage pressure summary",
  },
  "version-distribution": {
    label: "Version distribution",
    description: "OpenShift version spread across the fleet",
  },
  "health-by-group": {
    label: "Health by group",
    description: "Cluster health rolled up by fleet group or environment",
  },
  "active-incidents": {
    label: "Active incidents",
    description: "Open incidents and alerts needing triage",
  },
  "slo-error-budgets": {
    label: "SLO error budgets",
    description: "Remaining error budget by pipeline (Observability)",
  },
  "mttr-trend": {
    label: "MTTR trend",
    description: "Mean time to recovery over the last 6 months",
  },
};

const SECTION_IDS = Object.keys(OVERVIEW_SECTION_META) as OverviewSectionId[];

/** Default landing: fleet KPIs, action queue, rollouts, recommendations, and Your view pins. R1 optional widgets stay in Add widgets. */
export const DEFAULT_OVERVIEW_LAYOUT: OverviewLayoutPrefs = {
  sections: [
    { id: "fleet-summary", visible: true },
    { id: "attention", visible: true },
    { id: "fleet-rollouts", visible: true },
    { id: "recommendations", visible: true },
    { id: "pinned-insights", visible: true },
    { id: "getting-started", visible: false },
    { id: "capacity-chart", visible: false },
    { id: "version-distribution", visible: false },
    { id: "health-by-group", visible: false },
    { id: "active-incidents", visible: false },
    { id: "slo-error-budgets", visible: false },
    { id: "mttr-trend", visible: false },
  ],
};

const STORAGE_KEY = "ome-overview-layout-v4";

function normalizeSection(entry: OverviewSectionLayout): OverviewSectionLayout {
  return {
    id: entry.id,
    visible: entry.visible,
    locked: entry.locked ?? false,
    height: entry.height ?? "default",
  };
}

function isOverviewSectionId(value: string): value is OverviewSectionId {
  return SECTION_IDS.includes(value as OverviewSectionId);
}

function mergeWithDefaults(partial: unknown): OverviewLayoutPrefs {
  if (
    !partial ||
    typeof partial !== "object" ||
    !Array.isArray((partial as OverviewLayoutPrefs).sections)
  ) {
    return DEFAULT_OVERVIEW_LAYOUT;
  }

  const saved = (partial as OverviewLayoutPrefs).sections
    .filter(
      (entry): entry is OverviewSectionLayout =>
        Boolean(entry) &&
        typeof entry.id === "string" &&
        isOverviewSectionId(entry.id) &&
        typeof entry.visible === "boolean",
    )
    .map(normalizeSection);

  const savedIds = new Set(saved.map((entry) => entry.id));
  const missing = DEFAULT_OVERVIEW_LAYOUT.sections
    .filter((entry) => !savedIds.has(entry.id))
    .map(normalizeSection);

  const partialPrefs = partial as OverviewLayoutPrefs;
  const yourViewCardOrder = Array.isArray(partialPrefs.yourViewCardOrder)
    ? partialPrefs.yourViewCardOrder.filter(
        (id): id is string =>
          typeof id === "string" && DEFAULT_YOUR_VIEW_CARD_IDS.includes(id),
      )
    : undefined;

  return {
    sections: [...saved, ...missing],
    ...(yourViewCardOrder ? { yourViewCardOrder } : {}),
  };
}

export function getYourViewCardOrder(prefs: OverviewLayoutPrefs): string[] {
  const saved = prefs.yourViewCardOrder ?? [];
  const validSaved = saved.filter((id) => DEFAULT_YOUR_VIEW_CARD_IDS.includes(id));
  const missing = DEFAULT_YOUR_VIEW_CARD_IDS.filter((id) => !validSaved.includes(id));
  return [...validSaved, ...missing];
}

export function reorderYourViewCards(
  prefs: OverviewLayoutPrefs,
  draggedId: string,
  targetId: string,
): OverviewLayoutPrefs {
  if (draggedId === targetId) return prefs;

  const order = getYourViewCardOrder(prefs);
  const fromIndex = order.indexOf(draggedId);
  const toIndex = order.indexOf(targetId);
  if (fromIndex < 0 || toIndex < 0) return prefs;

  const next = [...order];
  const [entry] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, entry);
  return { ...prefs, yourViewCardOrder: next };
}

export function loadOverviewLayout(): OverviewLayoutPrefs {
  if (typeof window === "undefined") return DEFAULT_OVERVIEW_LAYOUT;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem("ome-overview-layout-v3") ??
      window.localStorage.getItem("ome-overview-layout-v2") ??
      window.localStorage.getItem("ome-overview-layout-v1");
    if (!raw) return DEFAULT_OVERVIEW_LAYOUT;
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    return DEFAULT_OVERVIEW_LAYOUT;
  }
}

export function saveOverviewLayout(prefs: OverviewLayoutPrefs): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function resetOverviewLayout(): OverviewLayoutPrefs {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("ome-overview-layout-v3");
    window.localStorage.removeItem("ome-overview-layout-v2");
    window.localStorage.removeItem("ome-overview-layout-v1");
  }
  return DEFAULT_OVERVIEW_LAYOUT;
}

export function visibleOverviewSections(
  prefs: OverviewLayoutPrefs,
): OverviewSectionLayout[] {
  return prefs.sections
    .filter((section) => section.visible)
    .map(normalizeSection);
}

export function countVisibleOverviewSections(prefs: OverviewLayoutPrefs): number {
  return prefs.sections.filter((section) => section.visible).length;
}

export function reorderOverviewSections(
  prefs: OverviewLayoutPrefs,
  draggedId: OverviewSectionId,
  targetId: OverviewSectionId,
): OverviewLayoutPrefs {
  if (draggedId === targetId) return prefs;

  const sections = [...prefs.sections];
  const dragged = sections.find((section) => section.id === draggedId);
  const target = sections.find((section) => section.id === targetId);
  if (dragged?.locked || target?.locked) return prefs;

  const fromIndex = sections.findIndex((section) => section.id === draggedId);
  const toIndex = sections.findIndex((section) => section.id === targetId);
  if (fromIndex < 0 || toIndex < 0) return prefs;

  const [entry] = sections.splice(fromIndex, 1);
  sections.splice(toIndex, 0, entry);
  return { sections };
}

export function isOverviewSectionVisible(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
): boolean {
  return prefs.sections.find((section) => section.id === id)?.visible ?? false;
}

export function addOverviewSectionAt(
  prefs: OverviewLayoutPrefs,
  sectionId: OverviewSectionId,
  targetId: OverviewSectionId,
): OverviewLayoutPrefs {
  const withVisible = setOverviewSectionVisible(prefs, sectionId, true);
  return reorderOverviewSections(withVisible, sectionId, targetId);
}

export function appendOverviewSection(
  prefs: OverviewLayoutPrefs,
  sectionId: OverviewSectionId,
): OverviewLayoutPrefs {
  const withVisible = setOverviewSectionVisible(prefs, sectionId, true);
  const sections = [...withVisible.sections];
  const dragged = sections.find((section) => section.id === sectionId);
  if (dragged?.locked) return withVisible;

  const fromIndex = sections.findIndex((section) => section.id === sectionId);
  if (fromIndex < 0) return withVisible;

  const [entry] = sections.splice(fromIndex, 1);
  sections.push(entry);
  return { ...withVisible, sections };
}

export function hiddenOverviewSections(
  prefs: OverviewLayoutPrefs,
): OverviewSectionLayout[] {
  return prefs.sections.filter((section) => !section.visible);
}

export function moveOverviewSection(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
  direction: "up" | "down",
): OverviewLayoutPrefs {
  const sections = [...prefs.sections];
  const index = sections.findIndex((section) => section.id === id);
  if (index < 0) return prefs;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= sections.length) return prefs;

  const [entry] = sections.splice(index, 1);
  sections.splice(targetIndex, 0, entry);
  return { sections };
}

export function setOverviewSectionVisible(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
  visible: boolean,
): OverviewLayoutPrefs {
  if (!visible && countVisibleOverviewSections(prefs) <= 1) {
    return prefs;
  }

  return {
    sections: prefs.sections.map((section) =>
      section.id === id ? { ...section, visible } : section,
    ),
  };
}

export function setOverviewSectionLocked(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
  locked: boolean,
): OverviewLayoutPrefs {
  return {
    sections: prefs.sections.map((section) =>
      section.id === id ? { ...section, locked } : section,
    ),
  };
}

export function setOverviewSectionHeight(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
  height: OverviewWidgetHeight,
): OverviewLayoutPrefs {
  return {
    sections: prefs.sections.map((section) =>
      section.id === id ? { ...section, height } : section,
    ),
  };
}

export function getOverviewSectionState(
  prefs: OverviewLayoutPrefs,
  id: OverviewSectionId,
): OverviewSectionLayout {
  const section = prefs.sections.find((entry) => entry.id === id);
  if (!section) {
    return normalizeSection({ id, visible: false });
  }
  return normalizeSection(section);
}
