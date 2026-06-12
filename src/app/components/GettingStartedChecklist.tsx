import {
  SectionTitle,
  BodyText,
} from "../../imports/UIComponents";

type ChecklistItem = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export const gettingStartedChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    title: "Create/import your first cluster",
    description:
      "Get started by creating a new cluster or importing an existing one",
    completed: true,
  },
  {
    id: 2,
    title: "Deploy your first application",
    description: "Deploy an application across your clusters",
    completed: false,
  },
  {
    id: 3,
    title: "Create a policy",
    description:
      "Set up governance policies to ensure compliance",
    completed: false,
  },
  {
    id: 4,
    title: "Enable auto-upgrades on your infrastructure",
    description:
      "Keep your clusters up to date automatically with auto-migration of workloads",
    completed: false,
  },
];

export function getGettingStartedProgress() {
  const completed = gettingStartedChecklistItems.filter(
    (item) => item.completed,
  ).length;
  return { completed, total: gettingStartedChecklistItems.length };
}

type GettingStartedChecklistProps = {
  /** Omit page-level heading when nested inside Overview collapsible. */
  embedded?: boolean;
};

export function GettingStartedChecklist({
  embedded = false,
}: GettingStartedChecklistProps) {
  const completedCount = gettingStartedChecklistItems.filter(
    (item) => item.completed,
  ).length;
  const totalCount = gettingStartedChecklistItems.length;
  const progressPercentage =
    (completedCount / totalCount) * 100;

  return (
    <section className={embedded ? "mb-0" : "mb-12"}>
      {!embedded ? (
        <div className="mb-5">
          <SectionTitle>Getting started</SectionTitle>
          <BodyText muted>
            Complete these steps to get the most out of Red Hat OpenShift
            Management Engine
          </BodyText>
        </div>
      ) : null}

      <div
        className={`bg-card border p-6 ${embedded ? "border-0 p-0" : ""}`}
        style={
          embedded
            ? undefined
            : {
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
                borderWidth: "1px",
              }
        }
      >
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span
              style={{
                fontFamily: "var(--font-family-text)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--foreground)",
              }}
            >
              Progress
            </span>
            <span
              style={{
                fontFamily: "var(--font-family-text)",
                fontSize: "var(--text-sm)",
                color: "var(--muted-foreground)",
              }}
            >
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div
            className="h-2 bg-secondary overflow-hidden"
            style={{ borderRadius: "var(--radius)" }}
          >
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-4">
          {gettingStartedChecklistItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                  <button
                    className="size-5 border-2 flex items-center justify-center transition-colors"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      borderColor: item.completed
                        ? "var(--primary)"
                        : "var(--border)",
                      backgroundColor: item.completed
                        ? "var(--primary)"
                        : "transparent",
                    }}
                  >
                    {item.completed && (
                      <svg
                        className="size-3"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="var(--primary-foreground)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontFamily: "var(--font-family-text)",
                      fontSize: "var(--text-base)",
                      fontWeight: "var(--font-weight-medium)",
                      color: item.completed
                        ? "var(--muted-foreground)"
                        : "var(--foreground)",
                      textDecoration: item.completed
                        ? "line-through"
                        : "none",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-family-text)",
                      fontSize: "var(--text-sm)",
                      color: "var(--muted-foreground)",
                      marginTop: "var(--spacing-1)",
                    }}
                  >
                    {item.description}
                  </div>
                </div>

                {/* Action button */}
                <button
                  className="px-4 h-9 hover:bg-secondary transition-colors"
                  style={{
                    borderRadius: "var(--radius)",
                    fontFamily: "var(--font-family-text)",
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--font-weight-medium)",
                    color: item.completed
                      ? "var(--muted-foreground)"
                      : "var(--primary)",
                  }}
                  disabled={item.completed}
                >
                  {item.completed ? "Done" : "Start"}
                </button>
              </div>

              {/* Divider (except for last item) */}
              {index < gettingStartedChecklistItems.length - 1 && (
                <div
                  className="mt-4 h-px"
                  style={{ backgroundColor: "var(--border)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}