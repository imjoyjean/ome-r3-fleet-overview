import { useNavigate } from "react-router";
import {
  PageTitle,
  SmallText,
  TinyText,
  Container,
  SecondaryButton,
  Badge,
} from "../../../imports/UIComponents";
import { deploymentCopy } from "./deploymentPrototypeCopy";
import { FleetRolloutSummarySection } from "./FleetRolloutDetailChrome";
import type { FleetRolloutDetail } from "./fleetRolloutDemoData";

type FleetRolloutCompletedDetailProps = {
  detail: FleetRolloutDetail;
};

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FleetRolloutCompletedDetail({
  detail,
}: FleetRolloutCompletedDetailProps) {
  const navigate = useNavigate();
  const summary = detail.completedSummary;

  return (
    <Container className="p-8">
      <div className="mb-4">
        <SecondaryButton
          onClick={() => navigate(deploymentCopy.fleetRollout.basePath)}
          className="flex items-center gap-2"
        >
          <svg className="size-4" fill="none" viewBox="0 0 16 16">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{deploymentCopy.fleetRolloutDetail.backToList}</span>
        </SecondaryButton>
      </div>

      <header className="mb-2">
        <PageTitle className="mb-1">{detail.action}</PageTitle>
        <SmallText
          className="mb-3 font-mono"
          style={{ color: "var(--muted-foreground)", display: "block" }}
        >
          {detail.actionTargets}
        </SmallText>
        <Badge
          variant="success"
          className="text-xs"
          style={{ backgroundColor: "#3E8635", color: "#fff" }}
        >
          {detail.status}
        </Badge>
      </header>

      <FleetRolloutSummarySection detail={detail} />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.rolloutId}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.id}
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.scope}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.selector} ({detail.affectedClusters} clusters)
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.duration}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {summary?.durationLabel ?? "—"}
          </SmallText>
        </div>
        <div>
          <TinyText muted className="mb-1">
            {deploymentCopy.fleetRolloutDetail.completedAt}
          </TinyText>
          <SmallText style={{ fontWeight: "var(--font-weight-medium)" }}>
            {detail.endTime ? formatDate(detail.endTime) : "—"}
          </SmallText>
        </div>
      </div>

      {summary ? (
        <section
          className="rounded-md border p-4"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "rgba(62, 134, 53, 0.04)",
            borderRadius: "var(--radius)",
          }}
        >
          <SmallText
            className="!mb-2"
            style={{ fontWeight: "var(--font-weight-medium)" }}
          >
            {deploymentCopy.fleetRolloutDetail.completedSummaryTitle}
          </SmallText>
          <SmallText className="!mb-2">{summary.morningAfterHeadline}</SmallText>
          <TinyText muted className="!block">
            {summary.verifiedAtLabel}
            {summary.auditRef
              ? ` · ${deploymentCopy.fleetRolloutDetail.changeTicket} ${summary.auditRef}`
              : null}
          </TinyText>
        </section>
      ) : null}
    </Container>
  );
}
